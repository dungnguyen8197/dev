import { TableCell, TableRow } from "@mui/material";
import DefaultTable from "components/DefaultTable";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { formatDate } from "utils/date";
import CmsContainer from "components/CmsContainer";
import CmsAction from "components/CmsAction";

export default function List({ tableData, search, modify, remove, paging, refetch, isLoading }) {
  return (
    <CmsContainer
      addOptions={{ title: "Tạo tài khoản", onShowAdd: modify.handleOpenAdd }}
      title="Quản lý quản trị viên"
      searchOptions={{
        title: "Tìm kiếm",
        onSearch: refetch,
        datasets: [
          {
            label: "Số điện thoại",
            value: search.phone,
            onChange: search.handleChangePhone,
          },
        ],
      }}
    >
      <DefaultTable
        columns={["Tên đăng nhập", "Tên người dùng", "Số điện thoại", "Trạng thái", "Ngày tạo", ""]}
        paging={paging}
        isLoading={isLoading}
      >
        {tableData.map((row) => (
          <TableRow key={row.id} sx={{ width: "100% !important" }}>
            <TableCell align="center">{row.username}</TableCell>
            <TableCell align="center">{row.name}</TableCell>
            <TableCell align="center">{row.phone}</TableCell>
            <TableCell align="center">{row.is_active}</TableCell>
            <TableCell align="center">{formatDate(row.created_at)}</TableCell>
            <TableCell align="center" sx={{ minWidth: "150px" }}>
              <CmsAction tooltip="Thay đổi quyền" color="info">
                <AdminPanelSettingsIcon sx={{ width: "18px", height: "18px" }} />
              </CmsAction>
              <CmsAction
                tooltip="Cập nhật tài khoản"
                onAction={() => modify.handleOpenModify(row)}
                color="success"
              >
                <BorderColorIcon sx={{ width: "16px", height: "16px" }} />
              </CmsAction>
              <CmsAction
                tooltip="Xóa tài khoản"
                onAction={() => remove.handleShowRemove(row)}
                color="error"
              >
                <DeleteIcon sx={{ width: "16px", height: "16px" }} />
              </CmsAction>
            </TableCell>
          </TableRow>
        ))}
      </DefaultTable>
    </CmsContainer>
  );
}
