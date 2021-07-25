import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, navigate } from "gatsby"
import { Input, Form, Button } from "antd"
import * as style from "./style.module.scss"
import Cardano from "../../../services/cardano"

const query = `
  query aggregate {
    assets_aggregate {
      aggregate {
        count
      }
    }
    tokenMints_aggregate {
      aggregate {
        count
      }
    }
    epochs_aggregate {
      aggregate {
        count
      }
    }
  }
`

const Explorer = () => {
  const [form] = Form.useForm()
  const networkBlock = useSelector((state) => state.settings.networkBlock)
  const [stat, setStat] = useState({
    assets: 0,
    epochs: 0,
    mints: 0,
  })

  useEffect(() => {
    if (networkBlock !== 0) {
      Cardano.explorer
        .query({
          query,
        })
        .then((result) => {
          setStat({
            assets: result?.data?.data?.assets_aggregate?.aggregate?.count || 0,
            epochs: result?.data?.data?.epochs_aggregate?.aggregate?.count || 0,
            mints:
              result?.data?.data?.tokenMints_aggregate?.aggregate?.count || 0,
          })
        })
    }
  }, [networkBlock])

  const onSearch = (value) => {
    const touched = form.isFieldsTouched()
    const hasValidationError = !!form
      .getFieldsError()
      .filter(({ errors }) => errors.length).length
    if (!touched || hasValidationError) {
      return
    }

    switch (detectEntity(value)) {
      case "asset":
        navigate(`/explorer/?asset=${value}`)
        break
      case "block":
        navigate(`/explorer/?block=${value}`)
        break
      case "transaction":
        navigate(`/explorer/?transaction=${value}`)
        break
      case "policyId":
        navigate(`/explorer/?policyID=${value}`)
        break
      case "address":
        navigate(`/explorer/?address=${value}`)
        break
      default:
        break
    }
  }

  const detectEntity = (search) => {
    try {
      if (search.startsWith("asset")) return "asset"
      if (Number(search)) return "block"
      if (search.length === 64) return "transaction"
      if (search.length === 56) return "policyId"
      if (Cardano.crypto.validateAddress(search)) return "address"
      return false
    } catch {
      return false
    }
  }

  return (
    <div className="ray__block pt-3">
      <h1 className="mb-5">
        Are you here to find NFT diamonds?
        <br />
        We've got something!{" "}
        <span role="img" aria-label="">
          🧐
        </span>
      </h1>
      <Form className="pb-4" form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="searchEntity"
          rules={[
            { required: true, message: "Required" },
            () => ({
              validator(_, value) {
                if (!value || detectEntity(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error("Must be a valid Cardano entity")
                )
              },
            }),
          ]}
        >
          <Input.Search
            allowClear
            size="large"
            className={style.input}
            enterButton="Search"
            onSearch={onSearch}
            autoComplete="off"
            placeholder="Search assets by fingerprint, policy id, transaction, block, or address"
          />
        </Form.Item>
      </Form>
      <h1 className="pt-3 mb-5">Better yet, mint your NFT token!</h1>
      <div className="mb-5">
        <Button
          onClick={() => {
            navigate("/mint-tokens/")
          }}
          type="primary"
          className={style.mintButton}
        >
          Mint a token!
        </Button>
      </div>
      <div className="text-muted mb-5 max-width-800">
        <p className="mb-2">
          Current epoch is <strong>{stat.epochs}</strong>. During this time,{" "}
          <strong>{stat.assets}</strong> tokens have been minted{" "}
          <strong>{stat.mints}</strong> times in <strong>{networkBlock}</strong>{" "}
          blocks.
        </p>
        <p>
          Didn't find what you were looking for? Check out the{" "}
          <Link to="/top-nft-projects/">Top NFT Projects</Link>!
        </p>
      </div>
    </div>
  )
}

export default Explorer
