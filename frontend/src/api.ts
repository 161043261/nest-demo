import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

export interface ICond {
  partialName: string;
  page: number;
  pageSize: number;
}

export interface IPeople {
  id: number;
  name: string;
  age: number;
  emailList?: { addr: string }[];
}

interface IRes {
  data: unknown;
  code: number;
  message: string;
}

export interface IEmail {
  peopleId: number;
  addr: string;
}

const insertPeople = (people: IPeople) =>
  axios.post('/people', people).then((res) => res.data as IRes);

const fetchPeopleList = (cond: ICond) =>
  axios.get('/people', { params: cond }).then((res) => res.data as IRes);

const updatePeople = (people: Partial<IPeople> & { id: number }) =>
  axios.patch(`/people/${people.id}`, people).then((res) => res.data as IRes);

const deletePeople = (id: number) =>
  axios.delete(`/people/${id}`).then((res) => res.data as IRes);

const addPeopleEmail = (email: IEmail) =>
  axios.post('/people/email', email).then((res) => res.data as IRes);

const swapEmailAddr = (addrList: string[]) =>
  axios.post('/people/swapEmailAddr', addrList).then((res) => res.data as IRes);

const api = {
  insertPeople,
  fetchPeopleList,
  updatePeople,
  deletePeople,
  addPeopleEmail,
  swapEmailAddr,
};

export default api;
