import React from "react"
import { navigate } from "gatsby"
import { Input, Form } from "antd"
import Cardano from "@/services/cardano"
import * as style from "./style.module.scss"

const SearchInput = () => {
  const [form] = Form.useForm()

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
        navigate(`/explorer/search/?asset=${value}`)
        break
      case "block":
        navigate(`/explorer/search/?block=${value}`)
        break
      case "transaction":
        navigate(`/explorer/search/?transaction=${value}`)
        break
      case "policyId":
        navigate(`/explorer/search/?policyID=${value}`)
        break
      case "address":
        navigate(`/explorer/search/?address=${value}`)
        break
      default:
        navigate(`/explorer/?name=${value}`)
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
    <Form className="pb-4" form={form} layout="vertical" requiredMark={false}>
      <Form.Item name="searchEntity">
        <Input.Search
          allowClear
          size="large"
          className={style.input}
          enterButton="Search"
          onSearch={onSearch}
          autoComplete="off"
          placeholder="Search assets by name, fingerprint, policy id, transaction, block, or address..."
        />
      </Form.Item>
    </Form>
  )
}

export default SearchInput
