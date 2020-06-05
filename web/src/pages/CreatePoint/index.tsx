import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './CreatePoint.css';
import logo from '../../assets/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi' ;
import {Map, TileLayer, Marker} from 'react-leaflet'
import api from '../../services/api';
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'
import Dropzone from './../../components/dropzone/index';

interface Item{
  id:number,
  title:string,
  image_url:string,
}

interface IBGEUFresponse {
  sigla:string,
}

interface IBGECityResponse {
  nome:string
}


const CreatePoint = () =>{
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUFS] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUF, setSelectedUF]= useState('0');
  const [selectedCity, setSelectedCity]= useState('0');
  const [selctedPPosition, setSelecetedPosition]= useState<[number,number]>([0,0]);
  const [initialPosition, setInitoialPosition]= useState<[number,number]>([0,0]);
  const [formData,setFormData] =useState ({name:'',email:'', whatsapp:'',})
  const [selectedItems, setSelectedItens] = useState<number[]>([])
  const [selectedFIle, setSelectedFIle] = useState<File>()
  
  const history = useHistory();
  useEffect( ()=> {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, []);

  useEffect(()=>{
    axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
       const initials = response.data.map(uf => uf.sigla)
       setUFS(initials)
    })
  },[]);

  useEffect (()=>{
    if(selectedUF==='0'){
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames)
    })
  },[selectedUF])

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      setInitoialPosition([latitude,longitude]);
    })
  }, [])

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>){
      const uf = event.target.value;
      setSelectedUF(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    setSelectedCity(city);
}

  function handleMapClik(event: LeafletMouseEvent){
    setSelecetedPosition([event.latlng.lat,event.latlng.lng])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target
    setFormData({...formData, [name]:value})
  }

  function handleSelectedItem(id: number){
    const alreadySelected = selectedItems.findIndex(item => item===id);
    if(alreadySelected > -1){
      const filteredItems = selectedItems.filter(item => item!==id)
      setSelectedItens(filteredItems)
    }
    else{
      setSelectedItens([...selectedItems,id])
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const {name, email, whatsapp} = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = selctedPPosition;
    const items = selectedItems;
  const data= new FormData() 
  data.append('name',name);
  data.append('email',email);
  data.append('whatsapp',whatsapp);
  data.append('uf',uf);
  data.append('city',city);  
  data.append('latitude',String(latitude)); 
  data.append('longitude',String(longitude));
  data.append('items',items.join(','));
  if(selectedFIle){
    data.append('image', selectedFIle)
  }
    await api.post('points',data)
    history.push('/')
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
      </header>
      <Link to="/">
        <FiArrowLeft/>Voltar para home
      </Link>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do<br/>Ponto de Coleta</h1>
        <Dropzone onFileUploaded={setSelectedFIle}/>
        <fieldset>
          <legend><h2>Dados</h2></legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleInputChange}/>
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
            </div>

            <div className="field">
              <label htmlFor="name">Nome da Entidade</label>
              <input type="text" name="name" id="name" onChange={handleInputChange}/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereco</h2>
            <span>Selecione o endereco no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={18.5} onclick={handleMapClik}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker  position={selctedPPosition}/>
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado(UF)</label>
              <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUF}>
                <option value="0">Selectione uma UF</option>
                {ufs.map(uf => (<option key={uf}  value={uf}>{uf}</option>))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="uf">Cidade</label>
              <select name="uf" id="uf" value={selectedCity} onChange={handleSelectedCity}>
                <option value="0">Selectione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend><h2>Itens de Coleta</h2></legend>
          <span>Selecione um ou mais itens abaixo</span>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id} onClick={()=>handleSelectedItem(item.id)} className={selectedItems.includes(item.id)? 'selected':''}>
              <img src={item.image_url} alt={item.title}/>
            <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;