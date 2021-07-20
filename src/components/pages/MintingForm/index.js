import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import QRCode from 'qrcode.react'
import { Popover, Form, Input, Tooltip, Upload, Button, Checkbox, Radio, InputNumber, Alert, message } from "antd"
import { InboxOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { SVGCopy, SVGZap, SVGClose } from "@/svg"
import Cardano from "../../../services/cardano"
import style from "./style.module.scss"

export default () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const mnemonic = useSelector((state) => state.settings.mnemonic)
  const address = useSelector((state) => state.settings.address)
  const storeSession = useSelector((state) => state.settings.storeSession)
  const addressStateLoading = useSelector((state) => state.settings.addressStateLoading)
  const addressState = useSelector((state) => state.settings.addressState)
  const networkSlot = useSelector((state) => state.settings.networkSlot)
  const policyId = useSelector((state) => state.settings.policyId)
  const [restore, setRestore] = useState(false)
  const [isMnemonicValid, setIsMnemonicValid] = useState(true)
  const [mnemonicToRestore, setMnemonicToRestore] = useState('')
  const [, forceUpdate] = useState()
  const [donateState, setDonateState] = useState(false)
  const [tokenType, setTokenType] = useState(721)
  const [error, setError] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'settings/GET_BALANCE'
    })
  }, [networkSlot, dispatch])

  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  const changeStoreSession = (e) => {
    const { checked } = e.target
    dispatch({
      type: 'settings/CHANGE_STORE_SESSION',
      payload: checked,
    })
  }

  const refreshBalance = () => {
    dispatch({
      type: 'settings/GET_BALANCE',
    })
  }

  const showRestore = () => setRestore(true)
  const hideRestore = () => {
    setMnemonicToRestore('')
    setRestore(false)
    setRestore(false)
    setIsMnemonicValid(true)
  }

  const validateMnemonic = (e) => {
    const { value } = e.target
    const isValid = Cardano.crypto.validateMnemonic(value)
    setMnemonicToRestore(value)
    if (value === '' || isValid) {
      setIsMnemonicValid(true)
    } else {
      setIsMnemonicValid(false)
    }
  }

  const restoreMnemonic = (value) => {
    if (isMnemonicValid && value) {
      if (!window.confirm('Proceed with caution!\nThis will replace the current mnemonic with the new one. Click Cancel and write down the old mnemonic if you want to keep it.')) {
        return
      }
      dispatch({
        type: 'settings/LOAD_APP',
        mnemonic: value,
      })
      setMnemonicToRestore('')
      setRestore(false)
    }
  }

  const generateNewSession = () => {
    if (!window.confirm('Proceed with caution!\nThis will replace the current mnemonic with the new one. Click Cancel and write down the old mnemonic if you want to keep it.')) {
      return
    }
    dispatch({
      type: 'settings/LOAD_APP',
      mnemonic: Cardano.crypto.generateMnemonic(),
    })
  }

  const addField = (url) => {
    const formFields = form.getFieldsValue()
    const mint = formFields.mint || []
    mint.push({
      image: url,
      amount: 1,
    })
    const newFields = mint.map((item, index) => {
      return {
        name: ['mint', index],
        value: item,
      }
    })
    form.setFields(newFields)
    forceUpdate(Math.random())
  }

  const mintNft = () => {
    setError(false)
    const touched = form.isFieldsTouched()
    const hasValidationError = !!form.getFieldsError().filter(({ errors }) => errors.length).length
    if (!touched || hasValidationError) {
      return
    }

    const values = form.getFieldsValue()

    const tokensToMint = values.mint.map((item) => {
      return {
        quantity: (item.amount).toString(),
        asset: {
          assetName: item.ticker,
          policyId
        }
      }
    })

    const donateOpts = {
      // donateAddress: 'addr1q9ky2t5najzxwsvjl2e6q60vvkcewfwr0ft63vcvce7hwmr30hw5ksyahzstrqal7g45aug24r8sdf5842lfwzg4c99qvvuqv3',
      donateAddress: 'addr_test1qzd2ulz7jx0zn3t90vep26f7gl9wkj03lx0w5ca0vhnl5u6nfathe437695m4cwzlgn959uswtm56dkkmvxjx6h6mfssh7t4zy',
      donateValue: '1000000',
    }
    const donate = donateState ? donateOpts : undefined

    const processedMetadata = {}
    let metadata = {}

    if (tokenType === 721) {
      values.mint.forEach(item => {
        const itemProcesses = Object.assign({}, item)
        delete itemProcesses.amount
        processedMetadata[item.ticker] = {
          ...item,
          publisher: "https://minterr.org",
        }
      })
      metadata = {
        "721": {
          [policyId]: processedMetadata,
        },
        publisher: "https://minterr.org",
      }
    }

    if (tokenType === 0) {
      metadata = {
        ...values.mint[0],
        publisher: "https://minterr.org",
      }
    }

    console.log(metadata)

    const tx = Cardano.crypto.txBuildMint(
      values.toAddress,
      tokensToMint,
      addressState.utxos,
      networkSlot,
      metadata,
      donate,
    )

    if (tx.error) {
      setError(tx.error)
    }

    if (tx.data) {
      dispatch({
        type: 'settings/SET_STATE',
        payload: {
          transaction: {
            data: tx.data,
            donate,
          },
        }
      })
    }
  }

  const uploadFiles = ({ file, fileList }) => {
    if (file.status === 'done') {
      addField(`ipfs://${file.response.Hash}`)
    }
  }

  const isFormEmpty = !(form.getFieldValue().mint && form.getFieldValue().mint.length)
  const formFields = form.getFieldValue()

  const formattedAddress = `${address.slice(0, 8)}...${address.slice(-10)}`
  const amount = addressState?.assets?.value
    ? parseInt(addressState.assets.value / 1000000, 10).toFixed(6)
    : '0.000000'

  return (
    <div className="ray__block">
      <h1 className="mb-5">
        Let's mint a Cardano token, creator! <span role="img" aria-label="">👋</span>
      </h1>
      <div className="mb-5">
        <ul className={style.faq}>
          <li>
            <i>1</i> Write down the mnemonic before you send the funds
          </li>
          <li>
            <i>2</i> Send at least 2 <span className="ray__ticker">ADA</span> (or 3 <span className="ray__ticker">ADA</span> if you want to donate) to the session address (~1.7 <span className="ray__ticker">ADA</span> will be sent back with minted tokens)
          </li>
          <li>
            <i>3</i> Make sure the balance is topped up
          </li>
          <li>
            <i>4</i> Enter the recipient address of minted tokens
          </li>
          <li>
            <i>5</i> Select token type
          </li>
          <li>
            <i>6</i> Make a donation!
          </li>
          <li>
            <i>7</i> Complete the form
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="mb-2">
            <span className="me-3"><strong>1. Session Mnemonic</strong></span>
            {!restore && (
              <span>
                <span
                  className="link me-3"
                  onClick={generateNewSession}
                  onKeyPress={generateNewSession}
                  role="button"
                  tabIndex="0"
                >
                  Generate New
                </span>
                <span
                  className="link me-3"
                  onClick={() => showRestore(true)}
                  onKeyPress={() => showRestore(true)}
                  role="button"
                  tabIndex="0"
                >
                  Restore
                </span>
                <Checkbox className="cursor-pointer" checked={storeSession} onChange={changeStoreSession}>
                  Store session
                </Checkbox>
              </span>
            )}
            {restore && (
              <span
                className="link me-3"
                onClick={() => hideRestore()}
                onKeyPress={() => hideRestore()}
                role="button"
                tabIndex="0"
              >
                Cancel
              </span>
            )}
          </div>
          <div className="mb-5">
            {!restore && (
              <CopyToClipboard text={mnemonic} onCopy={onCopy}>
                <Tooltip title="Copy to clipboard">
                  <h5 className="d-inline cursor-pointer mb-0">
                    <span className="me-2">{mnemonic || '—'}</span>
                    <span className="ray__icon ray__icon--inline">
                      <SVGCopy />
                    </span>
                  </h5>
                </Tooltip>
              </CopyToClipboard>
            )}
            {restore && (
              <div className={style.restoreInput}>
                <Input.Search
                  placeholder="Enter the mnemonic you want to restore"
                  allowClear
                  enterButton="Restore"
                  size="large"
                  value={mnemonicToRestore}
                  onChange={(e) => validateMnemonic(e)}
                  onSearch={(e) => restoreMnemonic(e)}
                />
                {!isMnemonicValid && (
                  <div className={`${style.restoreError} form-text text-danger`}>
                    Wrong mnemonic
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="mb-2">
            <strong className="me-2">2. Session Address</strong>
            <Popover
              content={<QRCode value={address} size="50" />}
            >
              <span className="link">QR Code</span>
            </Popover>
          </div>
          <div className="mb-5">
            <h5>
              <CopyToClipboard text={address} onCopy={onCopy}>
                <Tooltip title="Copy to clipboard">
                  <span className="cursor-pointer">
                    <span className="me-2 text-break">{address ? formattedAddress : '—'}</span>
                    <span className="ray__icon ray__icon--inline">
                      <SVGCopy />
                    </span>
                  </span>
                </Tooltip>
              </CopyToClipboard>
            </h5>
          </div>
        </div>
        <div className="col-6">
          <div className="mb-2">
            <span className="me-3"><strong>3. Address Balance</strong></span>
            {!addressStateLoading && (
              <span
                className="link"
                onClick={refreshBalance}
                onKeyPress={refreshBalance}
                role="button"
                tabIndex="0"
              >
                Refresh
              </span>
            )}
            {addressStateLoading && (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
          <h5 className="mb-5">{amount} <span className="ray__ticker">ADA</span></h5>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        preserve={true}
        onFinish={mintNft}
      >
        <div className="row">
          <div className="col-12">
            <div className="pb-4">
              <div className="mb-2"><strong>4. Mint To Address</strong></div>
              <Form.Item
                name="toAddress"
                rules={[
                  { required: true, message: 'Required' },
                  () => ({
                    validator(_, value) {
                      if (!value || (Cardano.crypto.validateAddress(value) === 'base')) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Must be a valid Shelley address'))
                    },
                  })
                ]}
              >
                <Input
                  size="large"
                  placeholder="addr1..."
                  allowClear
                  autoComplete="off"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="mb-5">
              <div className="mb-2"><strong>5. Token Type</strong></div>
              <Radio.Group value={tokenType} onChange={(e) => {
                setTokenType(e.target.value)
                form.resetFields(['mint'])
              }}>
                <Radio value={721} className="me-3">NFT</Radio>
                <Radio value={0} className="me-3">Regular</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="col-6">
            <div className="mb-5">
              <div className="mb-2">
                <span className="me-3"><strong>6. Donation</strong></span>
              </div>
              <Checkbox className="cursor-pointer" checked={donateState} onChange={(e) => setDonateState(e.target.checked)}>
                Donate 1 <span className="ray__ticker">ADA</span> for the further development
              </Checkbox>
            </div>
          </div>
        </div>
        {tokenType === 721 && (
          <div>
            <div className="row">
              <div className="col-12">
                <div className="mb-3"><strong>7. Upload Files & Edit Token Fields (Up to 30, max 2Mb each)</strong></div>
                <div className="mb-4">
                  <Upload.Dragger
                    maxCount={30}
                    action="https://ipfs.infura.io:5001/api/v0/add?stream-channels=true"
                    onChange={uploadFiles}
                    multiple
                  >
                    <div className="font-size-16">
                      <p className="ant-upload-drag-icon mt-4 mb-2">
                        <InboxOutlined />
                      </p>
                      <p>Click or drag file to this area to upload</p>
                      <p className="text-muted mb-4">
                        Support for a single or bulk upload. Strictly forbidden to upload pirated files or NSFW content
                      </p>
                    </div>
                  </Upload.Dragger>
                </div>
              </div>
            </div>
            <div className="row">
              <Form.List name="mint">
                {(fields, { remove }) => (
                  <>
                    {fields.map((field, index) => {
                      console.log(formFields)
                      const originalImage = formFields.mint[index].image
                      const image = originalImage && originalImage.startsWith('ipfs://')
                        ? `https://cloudflare-ipfs.com/ipfs/${originalImage.replace('ipfs://', '')}`
                        : originalImage
                      return (
                        <div className="col-12 col-lg-6" key={field.key}>
                          <div className="row">
                            <div className="col-6">
                              <div className={style.image}>
                                <div
                                  className={style.remove}
                                  onClick={() => {
                                    remove(field.name)
                                    forceUpdate(Math.random())
                                  }}
                                  onKeyPress={() => {
                                    remove(field.name)
                                    forceUpdate(Math.random())
                                  }}
                                  role="button"
                                  tabIndex="0"
                                >
                                  <span className="ray__icon">
                                    <SVGClose />
                                  </span>
                                </div>
                                <img src={image} alt="" />
                              </div>
                            </div>
                            <div className="col-6">
                              <Form.Item
                                {...field.restField}
                                name={[field.name, 'ticker']}
                                fieldKey={[field.fieldKey, 'ticker']}
                                rules={[
                                  { required: true, message: 'Required' },
                                  { pattern: new RegExp(/^[a-zA-Z0-9]+$/i), message: 'No special characters' }
                                ]}
                              >
                                <Input
                                  size="large"
                                  placeholder="Ticker (eg, XRAY001)"
                                  allowClear
                                  autoComplete="off"
                                />
                              </Form.Item>
                              <Form.Item
                                {...field.restField}
                                name={[field.name, 'name']}
                                fieldKey={[field.fieldKey, 'name']}
                                rules={[
                                  { required: true, message: 'Required' },
                                  { pattern: new RegExp(/^[a-zA-Z0-9()\-+&#!?.,\s]+$/i), message: 'No special characters' }
                                ]}
                              >
                                <Input
                                  size="large"
                                  placeholder="Name (eg, XRAY NFT #001)"
                                  allowClear
                                  autoComplete="off"
                                />
                              </Form.Item>
                              <Form.Item
                                {...field.restField}
                                name={[field.name, 'amount']}
                                fieldKey={[field.fieldKey, 'amount']}
                                rules={[{ required: true, message: 'Required' }]}
                              >
                                <InputNumber
                                  size="large"
                                  placeholder="Amount"
                                  autoComplete="off"
                                  className="w-100"
                                  precision={0}
                                  min={1}
                                  max={Number.MAX_SAFE_INTEGER}
                                />
                              </Form.Item>
                              <Form.Item
                                {...field.restField}
                                name={[field.name, 'image']}
                                fieldKey={[field.fieldKey, 'image']}
                                hidden
                              >
                                <Input />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </Form.List>
            </div>
            {/* {isFormEmpty && (
              <div className="mb-5 pt-3 pb-5 text-muted text-center">
                Upload the files first
              </div>
            )} */}
          </div>
        )}
        {tokenType === 0 && (
          <div>
            <Form.Item
              name={['mint', 0, 'ticker']}
              rules={[
                { required: true, message: 'Required' },
                { pattern: new RegExp(/^[a-zA-Z0-9]+$/i), message: 'No special characters' }
              ]}
            >
              <Input
                size="large"
                placeholder="Ticker (eg, XRAY)"
                allowClear
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name={['mint', 0, 'name']}
              rules={[
                { required: true, message: 'Required' },
                { pattern: new RegExp(/^[a-zA-Z0-9()\-+&#!?.,\s]+$/i), message: 'No special characters' }
              ]}
            >
              <Input
                size="large"
                placeholder="Name (eg, XRAY Token)"
                allowClear
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name={['mint', 0, 'amount']}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber
                size="large"
                placeholder="Amount"
                autoComplete="off"
                className="w-100"
                precision={0}
                min={1}
                max={Number.MAX_SAFE_INTEGER}
              />
            </Form.Item>
          </div>
        )}
        <div className="row mt-5">
          <div className="col-12">
            {error && (
              <Alert
                className="mb-4"
                type="error"
                message="Insufficient funds to send the transaction. Top up your address."
                closable
                afterClose={() => setError(false)}
              />
            )}
            <Button disabled={isFormEmpty && !(tokenType === 0)} htmlType="submit" size="large" className="ray__btn ray__btn--success w-100">
              <span className="ray__icon me-2">
                <SVGZap />
              </span>
              <span>Mint NFT Tokens</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}


