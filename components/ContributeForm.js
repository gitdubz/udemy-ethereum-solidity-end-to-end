import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import { theme } from '../components/ThemeProvider';
import NotificationBar from '../components/NotificationBar';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const styles = () => {
  return {
    header: {
      margin: 0,
      // padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 3}px`,
      // backgroundColor: theme.palette.background.paper,
      '& svg': {
        fontSize: 40,
        color: theme.palette.primary
      }
    },
    form: {
      padding: `${theme.spacing.unit * 2}px 0`
    },
    margin: {
      marginTop: theme.spacing.unit * 4
    }
  };
};

class ContributeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contribution: 0,
      minimumContribution: props.minimumContribution || 0,
      message: {
        text: '',
        type: 'success'
      },
      loading: false
    };
  }
  state = {};

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { address } = this.props;
    const accounts = await web3.eth.getAccounts();
    const { minimumContribution, contribution } = this.state;
    const contributionInWei = web3.utils.toWei(contribution, 'ether');
    const campaign = Campaign(address);

    if (accounts && accounts[0]) {
      if (contributionInWei < minimumContribution) {
        this.setState({
          message: {
            text: `Minimum contribution of ${minimumContribution} required`,
            type: 'error'
          },
          loading: false
        });

        return;
      }

      try {
        this.setState({
          message: { text: 'Processing...', type: 'info' },
          loading: true
        });
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: contributionInWei
        });

        Router.replaceRoute(`/campaigns/${address}`);
        this.setState({
          message: {
            text: 'Success! Thank you for your contribution',
            type: 'success'
          },
          loading: false,
          contribution: 0
        });
      } catch (err) {
        this.setState({
          message: { text: err.message, type: 'error' },
          loading: false
        });
      }
    } else {
      this.setState({
        message: { text: 'No Account', type: 'error' },
        loading: false
      });
    }
  };

  render() {
    const { classes, fullWidth } = this.props;
    const { contribution, minimumContribution, message, loading } = this.state;
    return (
      <Grid container justify="center">
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h4" align="center" color="primary" paragraph>
            CONTRIBUTE
          </Typography>
        </Grid>
        <Grid item md={fullWidth ? 12 : 6} className={classes.form}>
          <form onSubmit={this.onSubmit}>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">Ether</InputAdornment>
                )
              }}
              type="text"
              id="contribution"
              label="Amount to contribute"
              placeholder="eg. 1 Ether"
              helperText={`Minimum of ${web3.utils.fromWei(
                minimumContribution,
                'ether'
              )} ether required`}
              value={contribution}
              onChange={this.handleChange('contribution')}
              margin="normal"
            />

            <Button
              disabled={loading}
              className={classes.margin}
              fullWidth
              variant="outlined"
              color="primary"
              type="submit"
            >
              Contribute
            </Button>

            {message.text && (
              <NotificationBar
                variant={message.type}
                className={classes.margin}
                message={message.text}
              />
            )}
          </form>
        </Grid>
      </Grid>
    );
  }
}

ContributeForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContributeForm);
