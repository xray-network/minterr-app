import React, { useState } from "react"
import { navigate } from "gatsby"
import { Modal, Button, Result, Tooltip, message } from "antd"
import { useSelector, useDispatch } from "react-redux"
import { LoadingOutlined } from "@ant-design/icons"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { SVGZap } from "@/svg"
import Cardano from "@/services/cardano"

const TransactionModal = () => {
  const dispatch = useDispatch()
  const transaction = useSelector((state) => state.settings.transaction)
  const accountKeys = useSelector((state) => state.settings.accountKeys)
  const script = useSelector((state) => state.settings.script)
  const [waitingHash, setWaitingHash] = useState("")
  const [success, setSuccess] = useState(false)
  const [txInterval, setTxInterval] = useState()

  const handleCancel = () => {
    dispatch({
      type: "settings/SET_STATE",
      payload: {
        transaction: "",
      },
    })
    setWaitingHash("")
    setSuccess("")
    clearInterval(txInterval)
  }

  const handleView = (hash) => {
    handleCancel()
    navigate(`/explorer/search/?transaction=${hash}`)
  }

  const sendTx = () => {
    const signedTx = Cardano.crypto.txSign(
      transaction.data,
      accountKeys.privateKey,
      script
    )
    Cardano.explorer.txSend(signedTx).then((sendResult) => {
      const hash = sendResult?.data?.data?.submitTransaction?.hash
      if (hash) {
        setWaitingHash(hash)
        setTxInterval(
          setInterval(() => {
            Cardano.explorer.getTxByHash([hash]).then((checkResult) => {
              const transactions = checkResult?.data?.data?.transactions
              if (transactions.length) {
                setSuccess(true)
                clearInterval(txInterval)
                dispatch({
                  type: "settings/FETCH_NETWORK_STATE",
                })
              }
            })
          }, 5000)
        )
      }
    })
  }

  const onCopy = () => {
    message.success("Copied to clipboard")
  }

  return (
    <Modal
      title="Mint Tokens"
      footer={null}
      visible={transaction}
      onCancel={handleCancel}
      width={420}
      closable={!waitingHash || success}
      maskClosable={!waitingHash || success}
      keyboard={!waitingHash || success}
    >
      {!waitingHash && !success && (
        <div>
          <div className="mb-4 pt-5 pb-3 text-center">
            {transaction?.data?.outputs.reverse().map((output, outputIndex) => {
              const formattedAddress = `${output.address.slice(
                0,
                12
              )}...${output.address.slice(-14)}`
              return (
                <div className="mb-3" key={outputIndex}>
                  <h5 className="mb-2">Output</h5>
                  <div className="mb-2">
                    <CopyToClipboard text={output.address} onCopy={onCopy}>
                      <Tooltip title="Copy to clipboard">
                        <strong className="link">{formattedAddress}</strong>
                      </Tooltip>
                    </CopyToClipboard>
                  </div>
                  <span className="pe-3">
                    <strong>
                      {(parseInt(output.value, 10) / 1000000).toFixed(6)}
                    </strong>{" "}
                    <span className="ray__ticker">ADA</span>
                  </span>
                  {output.tokens.map((token, tokenIndex) => {
                    return (
                      <span className="pe-3" key={tokenIndex}>
                        <strong>{token.quantity}</strong>{" "}
                        <span className="ray__ticker">
                          {Buffer.from(token.asset.assetName, "hex").toString()}
                        </span>
                      </span>
                    )
                  })}
                </div>
              )
            })}
            {/* {transaction?.donate && (
              <div>
                <h5 className="mb-2">Donate to Minterr</h5>
                <strong>1</strong> <span className="ray__ticker">ADA</span>
              </div>
            )} */}
          </div>
          <Button
            size="large"
            className="ray__btn ray__btn--success w-100"
            onClick={sendTx}
          >
            <span className="ray__icon me-2">
              <SVGZap />
            </span>
            Mint!
          </Button>
        </div>
      )}
      {waitingHash && !success && (
        <div>
          <Result
            icon={<LoadingOutlined style={{ fontSize: 72 }} spin />}
            title={<h4>Minting...</h4>}
            subTitle={
              <div className="mb-2">
                <div className="mb-2">
                  <CopyToClipboard text={waitingHash} onCopy={onCopy}>
                    <Tooltip title="Copy to clipboard">
                      <span className="link">
                        Tx ID:{" "}
                        {`${waitingHash.slice(0, 12)}...${waitingHash.slice(
                          -14
                        )}`}
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                </div>
                <div>This may take a while, please wait.</div>
              </div>
            }
          />
        </div>
      )}
      {success && (
        <div className="text-center">
          <Result
            status="success"
            title={<h4>Successfully minted!</h4>}
            subTitle={
              <div>
                <CopyToClipboard text={waitingHash} onCopy={onCopy}>
                  <Tooltip title="Copy to clipboard">
                    <span className="link">
                      Tx ID:{" "}
                      {`${waitingHash.slice(0, 12)}...${waitingHash.slice(
                        -14
                      )}`}
                    </span>
                  </Tooltip>
                </CopyToClipboard>
                {/* <div>
                  <span
                    className="link"
                    onClick={() => handleView(waitingHash)}
                    onKeyPress={() => handleView(waitingHash)}
                    role="button"
                    tabIndex="0"
                  >
                    View Transaction in Explorer
                  </span>
                </div> */}
              </div>
            }
            extra={[
              <Button
                className="ray__btn ray__btn--success mx-auto"
                onClick={() => handleView(waitingHash)}
                size="large"
              >
                View Transaction
              </Button>,
            ]}
          />
        </div>
      )}
    </Modal>
  )
}

export default TransactionModal
