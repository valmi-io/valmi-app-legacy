/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, March 20th 2023, 9:48:25 pm
 * Author: Nagendra S @ valmi.io
 */

import { Table } from "antd";

const TableCpn = ({
	loading,
	columns,
	data,
	onChange,
	onClick,
	bordered = false,
	pageSize = 5,
	displayPagination = true,
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
			pagination={
				displayPagination && {
					defaultPageSize: pageSize,
				}
			}
			rowKey={(record) => {
				return record.id.toString();
			}}
			className="cursor-pointer"
		/>
	);
};

export default TableCpn;
