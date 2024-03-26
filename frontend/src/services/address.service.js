import api from './api';

const AddressList = () => {
    return api.get("/api/user/profile/address/")
    .then((response) => {
        return response.results
    })
    .catch((error)=>{
        throw error
    })
}

const AddressCreate = (address_type, country, city, street_address, apartment_address, postal_code) => {
    return api.post("/api/user/profile/address/", {
            "address_type": address_type,
            "default": true,
            "country": country,
            "city": city,
            "street_address": street_address,
            "apartment_address": apartment_address,
            "postal_code": postal_code
      })
    .catch((error) => {
        throw error
    })
}

const AddressUpdate = (address_type, country, city, street_address, apartment_address, postal_code, id) => {
    return api.put(`/api/user/profile/address/${id}/`, {
        "address_type": address_type,
        "default": true,
        "country": country,
        "city": city,
        "street_address": street_address,
        "apartment_address": apartment_address,
        "postal_code": postal_code
  })
.catch((error) => {
    throw error
})
}

const AddressDelete = (id) => {
    return api.delete(`/api/user/profile/address/${id}`, {
  })
.catch((error) => {
    throw error
})
}


const AddressService = {
    AddressCreate,
    AddressList,
    AddressUpdate,
    AddressDelete
}

export default AddressService;