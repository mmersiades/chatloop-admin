import axios from 'axios';

interface ExtremeIpResponse {
  status: string;
  country: string;
  countryCode: string;
}

type GetCountryCodeByIp = () => Promise<string>;

interface LocationService {
  getCountryCodeByIp: GetCountryCodeByIp;
}

const getCountryCodeByIp: GetCountryCodeByIp = async () => {
  const key = process.env.REACT_APP_IP_LOOKUP_KEY;
  if (!key) throw new Error('Ip lookup key not found');
  const { data } = await axios.get<ExtremeIpResponse>(
    `https://extreme-ip-lookup.com/json/?key=${key}`
  );
  return data.countryCode;
};

const locationService: LocationService = {
  getCountryCodeByIp,
};

export default locationService;
