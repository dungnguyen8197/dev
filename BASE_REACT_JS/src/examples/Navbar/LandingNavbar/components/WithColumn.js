import { Grid, Typography } from "@mui/material";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import styles from "assets/styles/examples/Navbar/LandingNavbar/WithColumn";

export default function WithColumn({ columns, calculateColumns }) {
  return (
    <Grid container spacing={3} py={1} px={1.5}>
      {calculateColumns.map((cols, key) => (
        <Grid key={`grid-${key}`} item xs={12 / columns} sx={styles.container}>
          {cols.map((col, index) => (
            <Fragment key={col.name}>
              <Typography sx={(e) => styles.name(e, { index })}>{col.name}</Typography>
              {col.collapse.map((item) => (
                <Typography
                  color="initial"
                  key={item.name}
                  component={item.route ? Link : MuiLink}
                  to={item.route ? item.route : ""}
                  href={item.href ? item.href : (e) => e.preventDefault()}
                  target={item.href ? "_blank" : ""}
                  rel={item.href ? "noreferrer" : "noreferrer"}
                  sx={styles.columnName}
                >
                  {item.name}
                </Typography>
              ))}
            </Fragment>
          ))}
          {key !== 0 && (
            <Divider key={`divider-${key}`} orientation="vertical" sx={styles.divider} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
