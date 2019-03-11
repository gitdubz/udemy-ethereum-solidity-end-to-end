import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DollarIcon from '@material-ui/icons/AttachMoney';
import { withStyles } from '@material-ui/core/styles';
import Footer from './Footer';
// import Theme from './ThemeProvider';
// import withMaterial from '../hocs/withMaterial';
import withLayout from '../lib/withLayout';
import { Link } from '../routes';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  link: {
    textDecoration: 'none'
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    '& svg': {
      marginRight: 5
    }
  }
});

class Layout extends Component {
  render() {
    const { classes, children } = this.props;
    return (
      // <Theme>
      <Fragment>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Link route="/">
              <a>
                <div className={classes.heading}>
                  <DollarIcon className={classes.icon} />
                  <Typography variant="h6" color="inherit" noWrap>
                    Kickstarter
                  </Typography>
                </div>
              </a>
            </Link>
          </Toolbar>
        </AppBar>
        <main>
          {/* <Theme>{children}</Theme> */}
          {children}
        </main>
        <Footer />
      </Fragment>
      // </Theme>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withLayout(withStyles(styles)(Layout));
// export default withStyles(styles)(Layout);
