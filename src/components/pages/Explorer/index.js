import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { Input, Form } from "antd"
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
  const [stat, setStat] = useState({
    assets: 0,
    epochs: 0,
    mints: 0,
  })
  const [search, setSearch] = useState('')

  useEffect(() => {
    Cardano.explorer.query({
      query,
    }).then((result) => {
      setStat({
        assets: result?.data?.data?.assets_aggregate?.aggregate?.count || 0,
        epochs: result?.data?.data?.epochs_aggregate?.aggregate?.count || 0,
        mints: result?.data?.data?.tokenMints_aggregate?.aggregate?.count || 0,
      })
    })
  }, [])

  const onSearch = () => {
    const touched = form.isFieldsTouched()
    const hasValidationError = !!form.getFieldsError().filter(({ errors }) => errors.length).length
    if (!touched || hasValidationError) {
      return
    }

    switch (detectEntity(search)) {
      case 'asset':
        navigate(`/explorer/token/${search}`)
        break
      case 'block':
        navigate(`/explorer/block/${search}`)
        break
      case 'transaction':
        navigate(`/explorer/transaction/${search}`)
        break
      case 'policyId':
        navigate(`/explorer/policyId/${search}`)
        break
      case 'address':
        navigate(`/explorer/address/${search}`)
        break
      default:
        break
    }
  }

  const detectEntity = (search) => {
    try {
      if (search.startsWith('asset')) return 'asset'
      if (Number(search)) return 'block'
      if (search.length === 64) return 'transaction'
      if (search.length === 56) return 'policyId'
      if (Cardano.crypto.validateAddress(search)) return 'address'
      return false
    } catch {
      return false
    }
  }

  return (
    <div className="ray__block pt-3">
      <h1 className="text-center mb-5">
        Are you here to find NFT diamonds?
        <br />
        We've got something! <span role="img" aria-label="">🧐</span>
      </h1>
      <Form
        className="pb-4"
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="searchEntity"
          rules={[
            { required: true, message: 'Required' },
            () => ({
              validator(_, value) {
                if (!value || (detectEntity(value))) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Must be a valid Cardano entity'))
              },
            })
          ]}
        >
          <Input.Search
            allowClear
            size="large"
            className={style.input}
            enterButton="Search"
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
            placeholder="Search assets by fingerprint, policy id, transaction, block, or address"
          />
        </Form.Item>
      </Form>
      <div className="text-muted text-center mb-5 max-width-800 ms-auto me-auto">
        Already <strong>{stat.assets}</strong> tokens have been minted <strong>{stat.mints}</strong> times in <strong>{stat.epochs}</strong> epochs.
      </div>
    </div>
  )
}

export default Explorer