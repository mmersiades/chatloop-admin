import axios from 'axios';

interface IpApiResponse {
  status: string;
  country: string;
  countryCode: string;
}

type GetCountryCodeByIp = () => Promise<string>;

interface LocationService {
  getCountryCodeByIp: GetCountryCodeByIp;
}

const getCountryCodeByIp: GetCountryCodeByIp = async () => {
  const { data } = await axios.get<IpApiResponse>('http://ip-api.com/json');
  return data.countryCode;
};

const locationService: LocationService = {
  getCountryCodeByIp,
};

export default locationService;
