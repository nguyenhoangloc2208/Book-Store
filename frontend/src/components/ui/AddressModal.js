import { useState } from 'react';
import '../../assets/styles/AddressModal.scss';
import AddressService from '../../services/address.service';
import { mutate } from 'swr';
import {toast} from 'react-hot-toast';
import PropTypes from 'prop-types';

const AddressModal = ({ isShowing, hide, create, item }) => {
    const [country, setCountry] = useState('');
    const [apartment, setApartment] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressType, setAddressType] = useState('');

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) { 
            hide();
        }
    };

    const handleAdressCU = async () =>{
        if(!create){
            await AddressService.AddressUpdate(addressType || item.address_type, country || item.country, city || item.city, street || item.street_address, apartment || item.apartment_address, postalCode || item.postal_code, item.id)
            hide();
            mutate('/api/user/profile/address/');
            return;
        }

        if (!addressType || !country || !city || !street || !apartment || !postalCode) {
            toast.error('Please fill in all fields');
            return; 
        }

        if(create){
            //Create
            await AddressService.AddressCreate(addressType, country, city, street, apartment, postalCode)
        }
        mutate('/api/user/profile/address/');
        hide();
    }

    return isShowing ? (
        <section className='address-modal' onClick={handleOverlayClick}>
            <div className='address-modal-content'>
                <div className='title'>
                    <div>
                        {create ? 'Add New Address' : 'Update Address'}
                    </div>
                    <div>
                        {create ? null : `${item.apartment_address}/${item.street_address}/${item.city}/${item.country}`}
                    </div>
                </div>
                <hr/>
                <div className='input-wrapper'>
                    <div className="form-floating input">
                        <select className="form-select" id="floatingSelect" aria-label="Floating label select example" value={addressType} onChange={(e) => setAddressType(e.target.value)}>
                            <option selected>Select Your Option</option>
                            <option value="B">Billing</option>
                            <option value="S">Shipping</option>
                        </select>
                        <label htmlFor="floatingSelect">Address Type</label>
                    </div>
                    <div className="form-floating input">
                        <select className="form-select" id="floatingSelect" aria-label="Floating label select example" value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option selected>Select Your Country</option>
                            <option value="VN">Vietnam</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="GB">United Kingdom</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                            <option value="JP">Japan</option>
                            <option value="KR">South Korea</option>
                            <option value="CN">China</option>
                            <option value="RU">Russia</option>
                        </select>
                        <label htmlFor="floatingSelect">Country</label>
                    </div>
                    <div className="form-floating input">
                        <input type="text" className="form-control" id="apartment" placeholder="Apartment" value={apartment} onChange={(e) => setApartment(e.target.value)} />
                        <label htmlFor="apartment">Apartment</label>
                    </div>
                    <div className="form-floating input">
                        <input type="text" className="form-control" id="street" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                        <label htmlFor="street">Street</label>
                    </div>
                    <div className="form-floating input">
                        <input type="text" className="form-control" id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        <label htmlFor="city">City</label>
                    </div>
                    <div className="form-floating input">
                        <input type="text" className="form-control" id="postalCode" placeholder="PostalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                        <label htmlFor="postalCode">Postal Code</label>
                    </div>
                </div>
                <button onClick={() => handleAdressCU()}>{create ? 'Add' : 'Update'}</button>
                
            </div>
        </section>
    ) : null;
};

AddressModal.propTypes = {
    isShowing: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    create: PropTypes.bool.isRequired,
    item: PropTypes.object
};

export default AddressModal;
