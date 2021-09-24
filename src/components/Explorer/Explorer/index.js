import React, { useEffect, useState } from "react"
import { Table, Input } from "antd"
import { Link, navigate } from "gatsby"
import { useSelector } from "react-redux"
import Cardano from "@/services/cardano"
import { format as formatDate } from "date-fns"
import { processAsset, format, truncate } from "@/utils/index"
import { SVGSearch } from "@/svg"
// import * as style from "./style.module.scss"

const query = (offset, name) => `
  query assets {
    assets_aggregate ${name ? `(where: {assetName: { _in: "${name}" }})` : ''} {
      aggregate {
        count
      }
    }
    assets(limit: 20, offset: ${offset} ${name ? `, where: { assetName: { _in: "${name}" } }` : ''}) {
      assetId
      assetName
      decimals
      description
      fingerprint
      logo
      name
      ticker
      tokenMints(limit: 1, order_by: { transaction: { includedAt: asc } }) {
        quantity
        transaction {
          hash
          includedAt
        }
      }
      tokenMints_aggregate {
        aggregate {
          count
          sum {
            quantity
          }
        }
      }
      url
      policyId
    }
  }
`

const columns = [
  {
    title: "Name",
    dataIndex: "assetName",
    key: "assetName",
    render: (record) => <strong>{record}</strong>,
  },
  {
    title: "Fingerprint",
    dataIndex: "fingerprint",
    key: "fingerprint",
    render: (record) => <Link to={`/explorer/search/?asset=${record}`}>{record}</Link>,
  },
  {
    title: "Policy Id",
    dataIndex: "policyId",
    key: "policyId",
    render: (record) => <Link to={`/explorer/search/?policyID=${record}`}>{truncate(record)}</Link>,
  },
  {
    title: "First Mint Date",
    dataIndex: "tokenMints",
    key: "tokenMints",
    render: (record) => formatDate(new Date(record[0].transaction.includedAt), "yyyy-MM-dd HH:mm:ss"),
  },
]

const Explorer = ({ search }) => {
  const init = useSelector((state) => state.settings.init)
  const [value, setValue] = useState(search)
  const [totalCount, setTotalCount] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    showSizeChanger: false,
    size: 'large',
    pageSize: '20',
    position: ['topLeft', 'bottomLeft']
  })

  useEffect(() => {
    if (init) {
      const hex = search ? Buffer.from(search, "utf-8").toString('hex') : ''
      fetchData(0, hex)
    }
    // eslint-disable-next-line
  }, [init, search])

  const fetchData = (offset, name = '') => {
    setLoading(true)
    Cardano.explorer.query({
      query: query(offset, name),
    }).then((result) => {
      const { data } = result
      if (data) {
        const { data: { assets, assets_aggregate: { aggregate: { count } } } } = data
        const processedAssets = assets.map((asset) => processAsset(asset))

        pagination.total = count
        setPagination(pagination)

        setLoading(false)
        setTotalCount(count)
        setDataSource(processedAssets)
      }
    })
  }

  const handleTableChange = (values) => {
    fetchData(values.current - 1)
  }

  const onSearch = (name) => {
    navigate(`?name=${name}`)
  }

  return (
    <div className="ray__block">
      <div className="ray__breadcrumbs">
        <Link to="/">Home</Link>
        <i>/</i>
        <span>Explorer</span>
      </div>
      <div className="ray__left mb-4">
        <h2 className="mb-0">
          {!search && (
            <div>
              Explorer: Cardano Native Tokens{" "}
              <span role="img" aria-label="">
                👀
              </span>
            </div>
          )}
          {search && (
            <div>
              Search Name: "{search}"
            </div>
          )}
        </h2>
        <span className="text-muted">Total {format(totalCount)} tokens</span>
      </div>
      <div className="mb-2">
        <Input.Search
          size="large"
          allowClear
          enterButton={
            <span className="ray__icon ray__icon--white ray__icon--22">
              <SVGSearch />
            </span>
          }
          onSearch={onSearch}
          onChange={e => setValue(e.target.value)}
          value={value}
          autoComplete="off"
          placeholder="Search assets by name (exact match and case sensitive)..."
        />
      </div>
      <div className="ray__table">
        <Table
          rowKey="fingerprint"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          onChange={handleTableChange}
          pagination={pagination}
        />
      </div>
    </div>
  )
}

export default Explorer
