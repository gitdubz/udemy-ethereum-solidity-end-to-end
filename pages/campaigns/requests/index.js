import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import DollarIcon from '@material-ui/icons/AttachMoney';
import { withStyles } from '@material-ui/core/styles';
import Campaign from '../../../ethereum/campaign';
import Layout from '../../../components/Layout';
import NotificationBar from '../../../components/NotificationBar';
import HeroSection from '../../../components/HeroSection';
import { Router } from '../../../routes';
import { theme } from '../../../components/ThemeProvider';
import web3 from '../../../ethereum/web3';

const styles = () => {
  return {
    root: {
      margin: `${theme.spacing.unit * 4}px 0`
    },
    margin: {
      margin: `${theme.spacing.unit * 4}px 0`
    },
    link: {
      textDecoration: 'none'
    }
  };
};

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount, 10))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    console.log(requests);

    return {
      address,
      requests,
      requestCount,
      approversCount
    };
  }

  state = {
    message: {
      text: '',
      type: 'success'
    },
    loading: false
  };

  onApprove = async id => {
    const { address } = this.props;
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    try {
      this.setState({
        message: { text: 'Processing...', type: 'info' },
        loading: true
      });

      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      });

      this.setState({
        message: { text: 'Success! Approval added', type: 'success' },
        loading: true
      });

      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      this.setState({
        message: { text: err.message, type: 'error' },
        loading: false
      });
      setTimeout(() => {
        this.setState(state => ({ message: {} }));
      }, 3000);
    }
  };

  onFinalize = async id => {
    const { address } = this.props;
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    try {
      this.setState({
        message: { text: 'Processing...', type: 'info' },
        loading: true
      });

      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0]
      });

      this.setState({
        message: { text: 'Success! Payment completed', type: 'success' },
        loading: true
      });

      Router.replaceRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      this.setState({
        message: { text: err.message, type: 'error' },
        loading: false
      });
      setTimeout(() => {
        this.setState(state => ({ message: {} }));
      }, 3000);
    }
  };

  render() {
    const {
      address,
      classes,
      requests,
      approversCount,
      requestCount
    } = this.props;
    const { message } = this.state;
    return (
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12}>
            <HeroSection
              header="Requests"
              description={`${requestCount} Requested payments`}
              action={{
                route: `/campaigns/${address}/requests/new`,
                label: 'Add Request'
              }}
            />
          </Grid>
          <Grid item xs={8}>
            {message.text && (
              <NotificationBar
                variant={message.type}
                className={classes.margin}
                message={message.text}
              />
            )}
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell align="center">Approval Count</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        {web3.utils.fromWei(row.value, 'ether')}
                      </TableCell>
                      <TableCell>{row.recipient}</TableCell>
                      <TableCell align="center">
                        {row.approvalCount} / {approversCount}
                      </TableCell>
                      <TableCell align="center">
                        {!row.complete ? (
                          <React.Fragment>
                            {row.approvalCount < approversCount && (
                              <Tooltip
                                placement="top"
                                title="Approve"
                                aria-label="Approve"
                              >
                                <IconButton
                                  onClick={() => this.onApprove(index)}
                                >
                                  <ThumbsUpIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {row.approvalCount >= approversCount / 2 && (
                              <Tooltip
                                placement="top"
                                title="Finalize"
                                aria-label="Finalize"
                              >
                                <IconButton
                                  onClick={() => this.onFinalize(index)}
                                >
                                  <DollarIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </React.Fragment>
                        ) : (
                          'Completed'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

export default withStyles(styles)(RequestIndex);
