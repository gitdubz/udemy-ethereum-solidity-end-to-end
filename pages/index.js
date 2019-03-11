import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Cards from '../components/Cards';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import factory from '../ethereum/factory';

const styles = theme => ({
  cardsContainer: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
});

class Index extends Component {
  static getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  };

  render() {
    const { classes, campaigns } = this.props;
    const cards = campaigns.map((address, index) => ({
      heading: `Campaign ${index + 1}`,
      description: address,
      id: address,
      route: `/campaigns/${address}`
    }));

    return (
      <Layout>
        <HeroSection />
        <div className={classes.cardsContainer}>
          <Cards items={cards} />
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Index);
