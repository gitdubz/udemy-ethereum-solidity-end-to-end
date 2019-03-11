import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import DownIcon from '@material-ui/icons/ArrowDownwardRounded';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import { theme } from '../../components/ThemeProvider';
import NotificationBar from '../../components/NotificationBar';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

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

class NewCampaign extends Component {
  state = {
    name: '',
    description: '',
    minimumContribution: '',
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

    if (accounts && accounts[0]) {
      const { name, description, minimumContribution } = this.state;
      try {
        this.setState({
          message: { text: 'Processing...', type: 'info' },
          loading: true
        });
        await factory.methods
          .createCampaign(minimumContribution, name, description)
          .send({
            from: accounts[0]
          });
        this.setState({
          message: {
            text: 'Success! Campaign has been created',
            type: 'success'
          },
          loading: false,
          minimumContribution: 0,
          name: '',
          description: ''
        });

        setTimeout(() => Router.pushRoute('/'), 1000);
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
    const { classes } = this.props;
    const {
      name,
      description,
      minimumContribution,
      message,
      loading
    } = this.state;
    return (
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.header}>
            <Typography
              variant="h4"
              align="center"
              color="textSecondary"
              paragraph
            >
              Let's add a campaign!
              <br />
              <br />
              <DownIcon />
            </Typography>
          </Grid>
          <Grid item md={6} className={classes.form}>
            <form onSubmit={this.onSubmit}>
              <TextField
                fullWidth
                type="text"
                id="name"
                label="Name"
                helperText=""
                value={name}
                onChange={this.handleChange('name')}
                margin="normal"
              />

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
                    <InputAdornment position="start">Wei</InputAdornment>
                  )
                }}
                type="text"
                id="minimum-contribution"
                label="Minimum Contribution"
                placeholder="eg. 100 Wei"
                helperText="The minimum amount required to be come a backer of your campaign"
                value={minimumContribution}
                onChange={this.handleChange('minimumContribution')}
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
                Create Campaign
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
      </Layout>
    );
  }
}

NewCampaign.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewCampaign);
