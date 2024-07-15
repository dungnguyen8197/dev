import { useQuery } from "react-query";
import { listAdmin } from "api/admin";

import List from "./section/List";
import ModifyDialog from "./section/ModifyDialog";

import useModify from "./hook/useModify";
import usePagination from "./hook/usePagination";
import useRemove from "./hook/useRemove";
import useSearch from "./hook/useSearch";

function Admin() {
  const paging = usePagination();
  const search = useSearch();
  const admins = useQuery("admins", () =>
    listAdmin({ phone: search.phone }, { number: paging.number, page: paging.page })
  );
  const modify = useModify(admins);
  const remove = useRemove(admins);

  return (
    <>
      <ModifyDialog modify={modify} />
      <List
        tableData={admins?.data?.data || []}
        search={search}
        modify={modify}
        remove={remove}
        paging={{ ...paging, count: admins?.data?.count || 0 }}
        refetch={admins.refetch}
        isLoading={admins.isLoading}
      />
    </>
  );
}

export default Admin;
