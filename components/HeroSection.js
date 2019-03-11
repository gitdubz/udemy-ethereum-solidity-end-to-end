import React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DollarIcon from '@material-ui/icons/AttachMoney';
import { Link } from '../routes';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  button: {
    color: '#fff'
  },
  link: {
    textDecoration: 'none'
  }
});

const HeroSection = props => {
  const {
    classes,
    header = 'Kickstarter',
    description = 'Because any idea might change the world for the better!',
    action = { label: 'Create Campaign', route: '/campaigns/new' }
  } = props;
  return (
    <div className={classes.heroUnit}>
      <div className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          {header}
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          {description}
        </Typography>
        {action && (
          <div className={classes.heroButtons}>
            <Grid container spacing={16} justify="center">
              <Grid item>
                <Link route={action.route}>
                  <a>
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      <DollarIcon className={classNames(classes.leftIcon)} />
                      {action.label}
                    </Button>
                  </a>
                </Link>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(HeroSection);
