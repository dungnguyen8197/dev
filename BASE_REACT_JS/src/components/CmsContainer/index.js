import { memo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Collapse, Grid, Typography } from "@mui/material";
import ClearableTextField from "components/ClearableTextField";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import styles from "assets/styles/components/CmsContainer/index";
import { cmsColumnCalculator, emptyFunction } from "utils/utils";

function CmsContainer({ children, searchOptions, addOptions, title }) {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography color="initial" variant="h4">
          {title}
        </Typography>
        <Box>
          <Button
            sx={styles.showSearchButton}
            onClick={() => setOpenSearch((prev) => !prev)}
            variant="outlined"
          >
            <SearchIcon sx={styles.showSearchIcon} />
          </Button>
          <Button sx={styles.addButton} onClick={addOptions.onShowAdd} variant="contained">
            <AddIcon sx={styles.addIcon} />
            <Typography color="white.main" variant="body2">
              {addOptions.title}
            </Typography>
          </Button>
        </Box>
      </Box>

      <Collapse in={Boolean(openSearch && searchOptions?.datasets?.length > 0)} timeout={500}>
        <Box sx={styles.searchContainer}>
          <Grid container spacing={4}>
            {searchOptions?.datasets?.slice(0, 4)?.map((value, index) => (
              <Grid key={index} item xs={cmsColumnCalculator(searchOptions.datasets.length)}>
                {value.renderSearch ? (
                  value.renderSearch
                ) : (
                  <ClearableTextField
                    onEnter={searchOptions.onSearch}
                    value={value.value}
                    onChange={value.onChange}
                    sx={styles.searchField}
                    label={value.label}
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={cmsColumnCalculator(searchOptions.datasets.length)}>
              <Button onClick={searchOptions.onSearch} sx={styles.searchButton} variant="outlined">
                <SearchIcon sx={styles.searchIcon} />
                <Typography color="initial.main" variant="body2">
                  {searchOptions.title}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {children}
    </Box>
  );
}

CmsContainer.defaultProps = {
  title: "",
  addOptions: {
    title: "",
    onShowAdd: emptyFunction,
  },
  searchOptions: {
    title: "Tìm kiếm",
    onSearch: emptyFunction,
    datasets: [],
  },
};

CmsContainer.propTypes = {
  title: PropTypes.string,
  addOptions: PropTypes.shape({
    title: PropTypes.string,
    onShowAdd: PropTypes.func,
  }),
  searchOptions: PropTypes.shape({
    title: PropTypes.string,
    onSearch: PropTypes.func,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        renderSearch: PropTypes.node,
      })
    ),
  }),
};

export default memo(CmsContainer);
