import { Table } from "antd";

const TableCpn = ({
	loading,
	columns,
	data,
	onChange,
	onClick,
	bordered = false,
	pageSize = 5,
}) => {
	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={data}
			onChange={onChange}
			bordered={bordered}
			onRow={(record) => {
				return {
					onClick: (e) => onClick(record),
				};
			}}
			pagination={{
				defaultPageSize: pageSize,
			}}
			rowKey={(record) => {
				return record.id.toString();
			}}
			style={{
				cursor: "pointer",
			}}
		/>
	);
};

export default TableCpn;
