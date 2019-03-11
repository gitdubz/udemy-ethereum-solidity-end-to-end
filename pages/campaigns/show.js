import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import DollarIcon from '@material-ui/icons/AttachMoney';
import MoneyIcon from '@material-ui/icons/Money';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import PersonIcon from '@material-ui/icons/PersonOutline';
import GroupIcon from '@material-ui/icons/Group';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import HeroSection from '../../components/HeroSection';
import ContributeForm from '../../components/ContributeForm';
import { theme } from '../../components/ThemeProvider';
import Campaign from '../../ethereum/campaign';
import { Link } from '../../routes';

const styles = () => {
  return {
    header: {
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 3}px`,
      backgroundColor: theme.palette.background.paper
    },
    margin: {
      marginTop: theme.spacing.unit * 4
    },
    padding: {
      padding: `${theme.spacing.unit * 4}px 0`
    },
    form: {
      padding: `${theme.spacing.unit * 4}px`,
      border: '1px solid #fff'
    },
    link: {
      textDecoration: 'none',
      marginLeft: 68
    }
  };
};

class ShowCampaign extends Component {
  state = {
    loading: true
  };

  static getInitialProps = async props => {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      name: summary[0],
      description: summary[1],
      summary: {
        balance: {
          icon: <DollarIcon />,
          label: 'Total Contributions',
          value: summary[2]
        },
        minimumContribution: {
          icon: <MoneyIcon />,
          label: 'Minimum Contribution',
          value: summary[3]
        },
        requestsCount: {
          icon: <ThumbsUpDownIcon />,
          label: 'Pending Requests',
          value: summary[4]
        },
        approversCount: {
          icon: <GroupIcon />,
          label: 'Total Investors',
          value: summary[5]
        },
        manager: {
          icon: <PersonIcon />,
          label: 'Manager Address',
          value: summary[6]
        }
      }
    };
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  showCampaignDetails = () => {
    const { address, classes } = this.props;
    const items = Object.keys(this.props.summary).map(key => {
      const { label, value, icon } = this.props.summary[key];
      return (
        <ListItem key={key}>
          <Avatar>{icon}</Avatar>
          <ListItemText primary={label} secondary={value} />
        </ListItem>
      );
    });

    return <List>{items}</List>;
  };

  render() {
    const { classes, address, name, description, summary } = this.props;
    const { loading } = this.state;
    return (
      <Layout>
        <Grid container justify="center">
          <Grid item xs={12}>
            <HeroSection
              action={false}
              header={name}
              description={description}
              action={{
                route: `/campaigns/${address}/requests`,
                label: 'View Requests'
              }}
            />
          </Grid>
          <Grid item md={8}>
            <Grid container className={classes.padding}>
              <Grid item md={8}>
                {!loading && this.showCampaignDetails()}
              </Grid>
              <Grid item md={4} className={classes.form}>
                <ContributeForm
                  fullWidth
                  address={address}
                  minimumContribution={summary.minimumContribution.value}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

ShowCampaign.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ShowCampaign);
