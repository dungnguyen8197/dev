import { memo } from "react";
import PropTypes from "prop-types";
// @mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import styles from "assets/styles/components/DefaultTable/index";
import { emptyFunction } from "utils/utils";
import { Box, CircularProgress, Fade } from "@mui/material";

function DefaultTable({ paging, children, columns, paginationOptions, isLoading, ...rest }) {
  return (
    <TableContainer {...rest}>
      {isLoading && (
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={30} />
        </Box>
      )}
      <Fade in={!isLoading} unmountOnExit timeout={500}>
        <Table>
          <TableBody>
            <TableRow>
              {columns.map((name) => (
                <TableCell key={name} align="center">
                  <Typography variant="body2" sx={styles.titleText}>
                    {name}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            {children}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                onPageChange={(_, p) => paging.setPage(p)}
                onRowsPerPageChange={(e) => paging.setNumber(e.target.value)}
                rowsPerPageOptions={paginationOptions.rowsPerPageOptions}
                count={paging.count}
                rowsPerPage={paging.number}
                page={paging.page}
                labelRowsPerPage={paginationOptions.labelRowsPerPage}
                sx={styles.pagination}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Fade>
    </TableContainer>
  );
}

DefaultTable.defaultProps = {
  columns: [],
  paginationOptions: {
    rowsPerPageOptions: [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "25", value: 25 },
    ],
    labelRowsPerPage: "",
  },
  paging: {
    page: 0,
    setPage: emptyFunction,
    number: 10,
    setNumber: emptyFunction,
    count: 0,
  },
  isLoading: false,
};

DefaultTable.propTypes = {
  paging: PropTypes.shape({
    page: PropTypes.number,
    setPage: PropTypes.func,
    rowsPerPage: PropTypes.number,
    setNumber: PropTypes.func,
    count: PropTypes.number,
  }),
  columns: PropTypes.array,
  paginationOptions: PropTypes.shape({
    rowsPerPageOptions: PropTypes.array,
    labelRowsPerPage: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};

export default memo(DefaultTable);
