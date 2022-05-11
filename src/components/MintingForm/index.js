import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useSelector, useDispatch } from "react-redux"
import QRCode from "qrcode.react"
import {
  Popover,
  Form,
  Input,
  Tooltip,
  Upload,
  Button,
  Checkbox,
  Radio,
  InputNumber,
  Alert,
  message,
} from "antd"
import { InboxOutlined } from "@ant-design/icons"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  SVGCopy,
  SVGZap,
  SVGClose,
  SVGCloseCircled,
  SVGAddCircled,
} from "@/svg"
import store from "store"
import { imageStringToCloudflare } from "@/utils/index"
import Cardano from "@/services/cardano"
import * as style from "./style.module.scss"

const network = store.get("app.settings.network")

const MintingForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const mnemonic = useSelector((state) => state.settings.mnemonic)
  const address = useSelector((state) => state.settings.address)
  // const storeSession = useSelector((state) => state.settings.storeSession)
  const addressStateLoading = useSelector(
    (state) => state.settings.addressStateLoading
  )
  const addressState = useSelector((state) => state.settings.addressState)
  const networkSlot = useSelector((state) => state.settings.networkSlot)
  const policyId = useSelector((state) => state.settings.policyId)
  const scriptHash = useSelector((state) => state.settings.scriptHash)
  const [restore, setRestore] = useState(false)
  const [isMnemonicValid, setIsMnemonicValid] = useState(true)
  const [mnemonicToRestore, setMnemonicToRestore] = useState("")
  const [, forceUpdate] = useState()
  const [donateState, setDonateState] = useState(true)
  const [tokenType, setTokenType] = useState(721)
  const [error, setError] = useState(false)

  useEffect(() => {
    dispatch({
      type: "settings/GET_BALANCE",
    })
  }, [networkSlot, dispatch])

  const onCopy = () => {
    message.success("Copied to clipboard")
  }

  // const changeStoreSession = (e) => {
  //   const { checked } = e.target
  //   dispatch({
  //     type: 'settings/CHANGE_STORE_SESSION',
  //     payload: checked,
  //   })
  // }

  const refreshBalance = () => {
    dispatch({
      type: "settings/GET_BALANCE",
    })
  }

  const showRestore = () => setRestore(true)
  const hideRestore = () => {
    setMnemonicToRestore("")
    setRestore(false)
    setRestore(false)
    setIsMnemonicValid(true)
  }

  const validateMnemonic = (e) => {
    const { value } = e.target
    const isValid = Cardano.crypto.validateMnemonic(value)
    setMnemonicToRestore(value)
    if (value === "" || isValid) {
      setIsMnemonicValid(true)
    } else {
      setIsMnemonicValid(false)
    }
  }

  const restoreMnemonic = (value) => {
    if (isMnemonicValid && value) {
      if (
        !window.confirm(
          "Proceed with caution!\nThis will replace the current mnemonic with the new one. Click Cancel and write down the old mnemonic if you want to keep it."
        )
      ) {
        return
      }
      dispatch({
        type: "settings/LOAD_APP",
        mnemonic: value,
      })
      setMnemonicToRestore("")
      setRestore(false)
    }
  }

  const generateNewSession = () => {
    if (
      !window.confirm(
        "Proceed with caution!\nThis will replace the current mnemonic with the new one. Click Cancel and write down the old mnemonic if you want to keep it."
      )
    ) {
      return
    }
    dispatch({
      type: "settings/LOAD_APP",
      mnemonic: Cardano.crypto.generateMnemonic(),
    })
  }

  const addField = (url) => {
    const formFields = form.getFieldsValue()
    const mint = formFields.mint || []
    mint.push({
      image: url,
      amount: undefined,
    })
    const newFields = mint.map((item, index) => {
      return {
        name: ["mint", index],
        value: item,
      }
    })
    form.setFields(newFields)
    forceUpdate(Math.random())
  }

  const mintNft = () => {
    setError(false)
    const touched = form.isFieldsTouched()
    const hasValidationError = !!form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length
    if (!touched || hasValidationError) {
      return
    }

    const values = form.getFieldsValue()

    console.log(values)

    const tokensToMint = values.mint.map((item) => {
      return {
        quantity: item.amount.toString(),
        asset: {
          assetName: item.ticker,
          policyId,
        },
      }
    })

    const donateOpts = {
      donateAddress:
        network === "testnet"
          ? "addr_test1qzd2ulz7jx0zn3t90vep26f7gl9wkj03lx0w5ca0vhnl5u6nfathe437695m4cwzlgn959uswtm56dkkmvxjx6h6mfssh7t4zy"
          : "addr1q9ky2t5najzxwsvjl2e6q60vvkcewfwr0ft63vcvce7hwmr30hw5ksyahzstrqal7g45aug24r8sdf5842lfwzg4c99qvvuqv3",
      donateValue: "1000000",
    }
    const donate = donateState ? donateOpts : undefined

    const processedMetadata = {}
    let metadata = {}

    if (tokenType === 721) {
      values.mint.forEach((item) => {
        const extra = {}
        if (item.extra) {
          item.extra.forEach((extraItem) => {
            extra[extraItem.key] = extraItem.value
          })
        }
        const itemProcessed = Object.assign({}, item)
        delete itemProcessed.amount
        delete itemProcessed.extra
        processedMetadata[item.ticker] = {
          ...itemProcessed,
          ...extra,
          // publisher: "https://minterr.io",
        }
      })
      metadata = {
        721: {
          [policyId]: processedMetadata,
        },
      }
    }

    if (tokenType === 0) {
      const extra = {}
      if (values.extra) {
        values.extra.forEach((extraItem) => {
          extra[extraItem.key] = extraItem.value
        })
      }
      metadata = {
        0: {
          ...extra,
          // publisher: "https://minterr.io",
        },
      }
    }

    const tx = Cardano.crypto.txBuildMint(
      values.toAddress,
      tokensToMint,
      addressState.utxos,
      networkSlot,
      metadata,
      donate
    )

    if (tx.error) {
      setError(tx.error)
    }

    if (tx.data) {
      dispatch({
        type: "settings/SET_STATE",
        payload: {
          transaction: {
            data: tx.data,
            donate,
          },
        },
      })
    }
  }

  const uploadFiles = ({ file }) => {
    if (file.status === "done") {
      addField(`ipfs://${file.response.Hash}`)
      form.validateFields()
    }
  }

  const validationRules = {
    required: { required: true, message: "Required" },
    noSpecial: {
      pattern: new RegExp(/^[a-zA-Z0-9]+$/i),
      message: "No special characters",
    },
    noSpecialSpace: {
      pattern: new RegExp(/^[a-zA-Z0-9\s]+$/i),
      message: "No special characters",
    },
    noSpecialSoft: {
      pattern: new RegExp(/^[a-zA-Z0-9()\-=+&#!?.,:\\/|\s]+$/i),
      message: "No special characters",
    },
    noReservedWords: {
      pattern: donateState ? new RegExp(/^(?!(image|ticker|name|amount)$)/) : new RegExp(/^(?!(image|ticker|name|amount|publisher)$)/),
      message: "No reserved words",
    },
    max64bytes: {
      max: 64,
      message: "Max 64 symbols",
    },
  }

  const formFields = form.getFieldValue()
  const formattedAddress = `${address.slice(0, 8)}...${address.slice(-12)}`
  const amount = addressState?.assets?.value
    ? parseInt(addressState.assets.value / 1000000, 10).toFixed(6)
    : "0.000000"

  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <span>Mint Cardano NFT Tokens</span>
      </div>
      <div className="ray__left mb-5">
        <h2 className="mb-4">
          Let's mint a Cardano token, creator.
          Absolutely free of charge!{" "}
          <span role="img" aria-label="">
            👋
          </span>
        </h2>
        <div>
          <ul className={style.faq}>
            <li>
              <span className="ray__point ray__point--outline">1</span> Write down
              the mnemonic before you send the funds
            </li>
            <li>
              <span className="ray__point ray__point--outline">2</span> Send at
              least 3 <span className="ray__ticker">ADA</span> to the session address (or 2{" "}
              <span className="ray__ticker">ADA</span> if you do not want to
              white label your token, in this case the Minterr publisher metadata field will be added). ~1.7{" "}
              <span className="ray__ticker">ADA</span> will be sent back with
              minted tokens.
            </li>
            <li>
              <span className="ray__point ray__point--outline">3</span> Make sure
              the balance is topped up
            </li>
            <li>
              <span className="ray__point ray__point--outline">4</span> Enter the
              recipient address of minted tokens
            </li>
            <li>
              <span className="ray__point ray__point--outline">5</span> Select
              token type
            </li>
            <li>
              <span className="ray__point ray__point--outline">6</span> Make sure
              the checkbox is checked :)
            </li>
            <li>
              <span className="ray__point ray__point--outline">7</span> Complete
              the form
            </li>
          </ul>
        </div>
      </div>
      <div className={style.mintingForm}>
        <div className="row">
          <div className="col-12">
            <div className="mb-2">
              <span className="me-3">
                <strong>
                  <span className="ray__point">1</span> Session Mnemonic
                </strong>
              </span>
              {!restore && (
                <span className="d-block d-sm-inline">
                  <span
                    className="link me-3"
                    onClick={generateNewSession}
                    onKeyPress={generateNewSession}
                    role="button"
                    tabIndex="0"
                  >
                    Reset / Generate New
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
                  {/* <Checkbox className="cursor-pointer" checked={storeSession} onChange={changeStoreSession}>
                  Store session
                </Checkbox> */}
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
                <div>
                  <CopyToClipboard text={mnemonic} onCopy={onCopy}>
                    <Tooltip title="Copy to clipboard">
                      <h5 className="d-inline cursor-pointer mb-0">
                        <span className="me-2">{mnemonic || "—"}</span>
                        <span className="ray__icon ray__icon--inline">
                          <SVGCopy />
                        </span>
                      </h5>
                    </Tooltip>
                  </CopyToClipboard>
                  <div className="text-muted mt-2 text-break">
                    PolicyID (no timelocks): {policyId}
                  </div>
                  <div className="text-muted mt-0 text-break">
                    Script Hash: {scriptHash}
                  </div>
                </div>
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
                    <div
                      className={`${style.restoreError} form-text text-danger`}
                    >
                      Wrong mnemonic
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="mb-2">
              <strong className="me-2">
                <span className="ray__point">2</span> Session Address
              </strong>
              <Popover content={<QRCode value={address} size="100" />}>
                <span className="link">QR Code</span>
              </Popover>
            </div>
            <div className="mb-5">
              <h5>
                <CopyToClipboard text={address} onCopy={onCopy}>
                  <Tooltip title="Copy to clipboard">
                    <span className="cursor-pointer">
                      <span className="me-2 text-break">
                        {address ? formattedAddress : "—"}
                      </span>
                      <span className="ray__icon ray__icon--inline">
                        <SVGCopy />
                      </span>
                    </span>
                  </Tooltip>
                </CopyToClipboard>
              </h5>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="mb-2">
              <span className="me-3">
                <strong>
                  <span className="ray__point">3</span> Address Balance
                </strong>
              </span>
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
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
            <h5 className="mb-5">
              {amount} <span className="ray__ticker">ADA</span>
            </h5>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          preserve={false}
          onFinish={mintNft}
        >
          <div className="row">
            <div className="col-12">
              <div className="pb-4">
                <div className="mb-2">
                  <strong>
                    <span className="ray__point">4</span> Mint To Address
                  </strong>
                </div>
                <Form.Item
                  name="toAddress"
                  rules={[
                    validationRules.required,
                    () => ({
                      validator(_, value) {
                        if (
                          !value ||
                          Cardano.crypto.validateAddress(value) === "base"
                        ) {
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error("Must be a valid Shelley address")
                        )
                      },
                    }),
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
            <div className="col-12 col-sm-6">
              <div className="mb-5">
                <div className="mb-2">
                  <strong>
                    <span className="ray__point">5</span> Token Type
                  </strong>
                </div>
                <Radio.Group
                  value={tokenType}
                  onChange={(e) => {
                    setTokenType(e.target.value)
                    form.resetFields(["mint"])
                  }}
                >
                  <Radio value={721} className="me-3">
                    NFT
                  </Radio>
                  <Radio value={0} className="me-3">
                    Regular
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="mb-5">
                <div className="mb-2">
                  <span className="me-3">
                    <strong>
                      <span className="ray__point">6</span> White Label
                    </strong>
                  </span>
                </div>
                <Checkbox
                  className="cursor-pointer"
                  checked={donateState}
                  onChange={(e) => setDonateState(e.target.checked)}
                >
                  Unlock publisher metadata field (requires at least 3 <span className="ray__ticker">ADA</span> on the balance)
                </Checkbox>
              </div>
            </div>
          </div>
          {tokenType === 721 && (
            <div>
              <Form.Item
                name="mint"
                rules={[{ required: true, message: "Required" }]}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <strong>
                        <span className="ray__point">7</span> Upload Files (Up
                        to 30) and Fill In Token Fields
                      </strong>
                    </div>
                    <div>
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
                            Support for a single or bulk upload. Strictly
                            forbidden to upload pirated files or NSFW content
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
                          const originalImage = formFields.mint[index].image
                          const image = imageStringToCloudflare(originalImage)

                          return (
                            <div className="col-12 mt-4" key={field.key}>
                              <div className="row">
                                <div className="col-12 col-sm-4 col-md-3 mb-4 mb-sm-0">
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
                                <div className="col-12 col-sm-8 col-md-9">
                                  <Form.Item
                                    {...field.restField}
                                    name={[field.name, "image"]}
                                    fieldKey={[field.fieldKey, "image"]}
                                    hidden
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Input.Group
                                    compact
                                    className={style.assetGroup}
                                  >
                                    <Form.Item className={style.assetKey}>
                                      <Input
                                        size="large"
                                        allowClear
                                        autoComplete="off"
                                        value="ticker"
                                        disabled
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      className={style.assetValue}
                                      {...field.restField}
                                      name={[field.name, "ticker"]}
                                      fieldKey={[field.fieldKey, "ticker"]}
                                      rules={[
                                        validationRules.required,
                                        validationRules.noSpecial,
                                        validationRules.max64bytes,
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        placeholder="eg, XRAY001"
                                        allowClear
                                        autoComplete="off"
                                      />
                                    </Form.Item>
                                  </Input.Group>
                                  <Input.Group
                                    compact
                                    className={style.assetGroup}
                                  >
                                    <Form.Item className={style.assetKey}>
                                      <Input
                                        size="large"
                                        allowClear
                                        autoComplete="off"
                                        value="name"
                                        disabled
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      className={style.assetValue}
                                      {...field.restField}
                                      name={[field.name, "name"]}
                                      fieldKey={[field.fieldKey, "name"]}
                                      rules={[
                                        validationRules.required,
                                        validationRules.noSpecialSoft,
                                        validationRules.max64bytes,
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        placeholder="eg, XRAY NFT #001"
                                        allowClear
                                        autoComplete="off"
                                      />
                                    </Form.Item>
                                  </Input.Group>
                                  <Input.Group
                                    compact
                                    className={style.assetGroup}
                                  >
                                    <Form.Item className={style.assetKey}>
                                      <Input
                                        size="large"
                                        allowClear
                                        autoComplete="off"
                                        value="amount"
                                        disabled
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      className={style.assetValue}
                                      {...field.restField}
                                      name={[field.name, "amount"]}
                                      fieldKey={[field.fieldKey, "amount"]}
                                      rules={[
                                        validationRules.required,
                                      ]}
                                    >
                                      <InputNumber
                                        size="large"
                                        placeholder="Integer Number"
                                        autoComplete="off"
                                        className="w-100"
                                        precision={0}
                                        min={1}
                                        max={Number.MAX_SAFE_INTEGER}
                                      />
                                    </Form.Item>
                                  </Input.Group>
                                  {!donateState && (
                                    <Input.Group
                                      compact
                                      className={style.assetGroup}
                                    >
                                      <Form.Item className={style.assetKey}>
                                        <Input
                                          size="large"
                                          allowClear
                                          autoComplete="off"
                                          value="publisher"
                                          disabled
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        className={style.assetValue}
                                        {...field.restField}
                                        name={[field.name, "publisher"]}
                                        fieldKey={[field.fieldKey, "publisher"]}
                                        initialValue="https://minterr.io"
                                      >
                                        <Input
                                          size="large"
                                          allowClear
                                          autoComplete="off"
                                          disabled
                                        />
                                      </Form.Item>
                                    </Input.Group>
                                  )}
                                  <Form.List name={[field.name, "extra"]}>
                                    {(
                                      extraFields,
                                      { add: extraAdd, remove: extraRemove }
                                    ) => (
                                      <>
                                        {extraFields.map(
                                          (extraField, extraIndex) => {
                                            return (
                                              <div key={extraIndex}>
                                                <Input.Group
                                                  compact
                                                  className={style.assetGroup}
                                                >
                                                  <Form.Item
                                                    className={style.assetKey}
                                                    {...extraField.restField}
                                                    name={[
                                                      extraField.name,
                                                      "key",
                                                    ]}
                                                    fieldKey={[
                                                      extraField.fieldKey,
                                                      "key",
                                                    ]}
                                                    rules={[
                                                      validationRules.required,
                                                      validationRules.noSpecialSpace,
                                                      validationRules.noReservedWords,
                                                      validationRules.max64bytes,
                                                    ]}
                                                  >
                                                    <Input
                                                      size="large"
                                                      allowClear
                                                      autoComplete="off"
                                                      placeholder="eg, url, twitter, author..."
                                                    />
                                                  </Form.Item>
                                                  <Form.Item
                                                    className={
                                                      style.assetValueShort
                                                    }
                                                    {...extraField.restField}
                                                    name={[
                                                      extraField.name,
                                                      "value",
                                                    ]}
                                                    fieldKey={[
                                                      extraField.fieldKey,
                                                      "value",
                                                    ]}
                                                    rules={[
                                                      validationRules.required,
                                                      validationRules.noSpecialSoft,
                                                      validationRules.max64bytes,
                                                    ]}
                                                  >
                                                    <Input
                                                      size="large"
                                                      allowClear
                                                      autoComplete="off"
                                                    />
                                                  </Form.Item>
                                                  <Form.Item
                                                    className={
                                                      style.assetRemove
                                                    }
                                                  >
                                                    <Button
                                                      className="ray__btn ray__btn--small ray__btn--transparent ps-2 pe-2"
                                                      onClick={() => {
                                                        extraRemove(
                                                          extraField.name
                                                        )
                                                      }}
                                                    >
                                                      <span className="ray__icon ray__icon--16 ray__icon--inline">
                                                        <SVGCloseCircled />
                                                      </span>
                                                    </Button>
                                                  </Form.Item>
                                                </Input.Group>
                                              </div>
                                            )
                                          }
                                        )}
                                        <Button
                                          className="ray__btn ray__btn--clear ray__btn--transparent"
                                          onClick={() => extraAdd()}
                                        >
                                          <span className="ray__icon ray__icon--inline me-1">
                                            <SVGAddCircled />
                                          </span>
                                          <span>Add Metadata Field</span>
                                        </Button>
                                      </>
                                    )}
                                  </Form.List>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </Form.List>
                </div>
              </Form.Item>
              {/* {isFormEmpty && (
              <div className="mb-5 pt-3 pb-5 text-muted text-center">
                Upload the files first
              </div>
            )} */}
            </div>
          )}
          {tokenType === 0 && (
            <div>
              <div className="mb-3">
                <strong>
                  <span className="ray__point">7</span> Fill In Token Fields
                </strong>
              </div>
              <Input.Group compact className={style.assetGroup}>
                <Form.Item className={style.assetKey}>
                  <Input
                    size="large"
                    allowClear
                    autoComplete="off"
                    value="ticker"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  className={style.assetValue}
                  name={["mint", 0, "ticker"]}
                  rules={[
                    validationRules.required,
                    validationRules.noSpecial,
                    validationRules.max64bytes,
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="eg, XRAY"
                    allowClear
                    autoComplete="off"
                  />
                </Form.Item>
              </Input.Group>
              <Input.Group compact className={style.assetGroup}>
                <Form.Item className={style.assetKey}>
                  <Input
                    size="large"
                    allowClear
                    autoComplete="off"
                    value="name"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  className={style.assetValue}
                  name={["mint", 0, "name"]}
                  rules={[
                    validationRules.required,
                    validationRules.noSpecialSoft,
                    validationRules.max64bytes,
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="eg, XRAY Token"
                    allowClear
                    autoComplete="off"
                  />
                </Form.Item>
              </Input.Group>
              <Input.Group compact className={style.assetGroup}>
                <Form.Item className={style.assetKey}>
                  <Input
                    size="large"
                    allowClear
                    autoComplete="off"
                    value="amount"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  className={style.assetValue}
                  name={["mint", 0, "amount"]}
                  rules={[validationRules.required]}
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
              </Input.Group>
              <Form.List name={["extra"]}>
                {(extraFields, { add: extraAdd, remove: extraRemove }) => (
                  <>
                    {extraFields.map((extraField, extraIndex) => {
                      return (
                        <div key={extraIndex}>
                          <Input.Group compact className={style.assetGroup}>
                            <Form.Item
                              className={style.assetKey}
                              {...extraField.restField}
                              name={[extraField.name, "key"]}
                              fieldKey={[extraField.fieldKey, "key"]}
                              rules={[
                                validationRules.required,
                                validationRules.noSpecialSpace,
                                validationRules.noReservedWords,
                                validationRules.max64bytes,
                              ]}
                            >
                              <Input
                                size="large"
                                allowClear
                                autoComplete="off"
                                placeholder="eg, url, twitter, author..."
                              />
                            </Form.Item>
                            <Form.Item
                              className={style.assetValueShort}
                              {...extraField.restField}
                              name={[extraField.name, "value"]}
                              fieldKey={[extraField.fieldKey, "value"]}
                              rules={[
                                validationRules.required,
                                validationRules.noSpecialSoft,
                                validationRules.max64bytes,
                              ]}
                            >
                              <Input
                                size="large"
                                allowClear
                                autoComplete="off"
                              />
                            </Form.Item>
                            <Form.Item className={style.assetRemove}>
                              <Button
                                className="ray__btn ray__btn--clear ray__btn--transparent ps-2 pe-2"
                                onClick={() => {
                                  extraRemove(extraField.name)
                                }}
                              >
                                <span className="ray__icon ray__icon--16 ray__icon--inline">
                                  <SVGCloseCircled />
                                </span>
                              </Button>
                            </Form.Item>
                          </Input.Group>
                        </div>
                      )
                    })}
                    <Button
                      className="ray__btn ray__btn--clear ray__btn--transparent"
                      onClick={() => extraAdd()}
                    >
                      <span className="ray__icon ray__icon--inline me-1">
                        <SVGAddCircled />
                      </span>
                      <span>Add Metadata Field</span>
                    </Button>
                  </>
                )}
              </Form.List>
            </div>
          )}
          <div className="row pt-4">
            <div className="col-12">
              {error && (
                <Alert
                  className="mb-4"
                  type="error"
                  message="Insufficient funds to send the transaction. Top up session address."
                  closable
                  afterClose={() => setError(false)}
                />
              )}
              <Button
                htmlType="submit"
                size="large"
                className="ray__btn ray__btn--success w-100"
              >
                <span className="ray__icon me-2">
                  <SVGZap />
                </span>
                <span>Mint Tokens!</span>
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default MintingForm
