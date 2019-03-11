import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../../../components/Layout';
import HeroSection from '../../../components/HeroSection';
import { theme } from '../../../components/ThemeProvider';
import NotificationBar from '../../../components/NotificationBar';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

const styles = () => {
  return {
    header: {
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 3}px`,
      backgroundColor: theme.palette.background.paper,
      '& svg': {
        fontSize: 40,
        color: theme.palette.primary
      }
    },
    form: {
      padding: `${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 8}px`
    },
    margin: {
      marginTop: theme.spacing.unit * 4
    }
  };
};

// const asd = props => (
//   <div className={props.classes.container}>
//     <div className={props.classes.content}>
//       <Typography variant="h6" align="center" color="textSecondary" paragraph>
//         Let's add a campaign!
//       </Typography>
//     </div>
//   </div>
// );

// const Asd = withStyles(styles)(asd);
let campaign;

class NewRequest extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    return {
      address
    };
  }

  state = {
    value: '',
    description: '',
    recipientAddress: '',
    message: {
      text: '',
      type: 'success'
    },
    loading: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const { address } = this.props;

    if (accounts && accounts[0]) {
      const campaign = Campaign(address);
      const { value, description, recipientAddress } = this.state;
      const valueInWei = web3.utils.toWei(value, 'ether');
      try {
        this.setState({
          message: { text: 'Processing...', type: 'info' },
          loading: true
        });
        await campaign.methods
          .createRequest(description, valueInWei, recipientAddress)
          .send({
            from: accounts[0]
          });

        this.setState({
          message: {
            text: 'Success! Payment request created',
            type: 'success'
          },
          loading: false,
          minimumContribution: 0,
          name: '',
          description: ''
        });

        setTimeout(
          () => Router.pushRoute(`/campaigns/${address}/requests`),
          1000
        );
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
    const { classes, address } = this.props;
    const {
      value,
      description,
      recipientAddress,
      message,
      loading
    } = this.state;
    return (
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.header}>
            <HeroSection
              header="Request payment"
              description="Let's add a request"
              action={false}
            />
          </Grid>
          <Grid item md={6} className={classes.form}>
            <form onSubmit={this.onSubmit}>
              <TextField
                fullWidth
                type="text"
                id="description"
                label="Description"
                helperText=""
                value={description}
                onChange={this.handleChange('description')}
                margin="normal"
              />

              <TextField
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">Ether</InputAdornment>
                  )
                }}
                type="text"
                id="value"
                label="Total"
                placeholder="eg. 1 Ether"
                value={value}
                onChange={this.handleChange('value')}
                margin="normal"
              />

              <TextField
                fullWidth
                type="text"
                id="recipientAddress"
                label="Recipient Address"
                helperText=""
                value={recipientAddress}
                onChange={this.handleChange('recipientAddress')}
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
                Request
              </Button>
              <Link href={`/campaigns/${address}/requests`}>
                <Button
                  disabled={loading}
                  className={classes.margin}
                  fullWidth
                  variant="outlined"
                  color="primary"
                  type="button"
                >
                  Cancel
                </Button>
              </Link>

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
      </Layout>
    );
  }
}

NewRequest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewRequest);
