import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x73A5C010C2F1445229e13028C729419eA714e3EC'
);
export default instance;
