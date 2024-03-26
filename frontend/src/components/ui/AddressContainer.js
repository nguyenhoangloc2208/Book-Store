import React, { useState } from 'react';
import AddressModal from '../../components/ui/AddressModal';
import AddressService from '../../services/address.service';
import { mutate } from 'swr';
import useModal from '../../hooks/useModal';

import '../../assets/styles/AddressContainer.scss';

const AddressContainer = ({ address, checkout,selectedAddress,  setSelectedAddress }) => {

    const {isShowing, toggle} = useModal();
    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState();


    const handleAddressNew = () => {
        setIsCreate(true);
        toggle();
    }

    const handleAddressUpdate = (item) => {
        setIsCreate(false);
        setItem(item);
        toggle();
    }

    const handleDeleteAddress = async (id) => {
        try{
            await AddressService.AddressDelete(id);
        }catch(err){
            console.error(err);
        }
        await mutate('/api/user/profile/address/');
    }

    const handleAddressSelect = (id) => {
        setSelectedAddress(id);
    }

    return (
        <div className="address-container">
            <h1>{checkout ? 'Pick an address' : 'Address'}</h1>
            <div className="address-info">
                {address && address.length > 0 ? address.map((item, index) => (
                    <div className="address" key={index}>
                        <div>
                            <input
                                type="radio"
                                name="address"
                                value={item.id}
                                checked={selectedAddress === item.id}
                                onChange={() => handleAddressSelect(item.id)}
                            />
                            Address {index+1}: {item.apartment_address}/{item.street_address}/{item.city}/{item.country} &nbsp; Postal Code: {item.postal_code}</div>
                        <i onClick={() => handleAddressUpdate(item)} className="fa-solid fa-pen"></i>
                        <i onClick={() => handleDeleteAddress(item.id)} className="fa-solid fa-circle-xmark"></i>
                    </div>
                )): <div>No address yet...</div>}
            </div>
            <div className="address-update">
                <button onClick={handleAddressNew}>Add new address</button>
                {isCreate ? (
                    <AddressModal
                        isShowing={isShowing}
                        hide={toggle}
                        create={isCreate}
                    />
                ) : (
                    <AddressModal
                        isShowing={isShowing}
                        hide={toggle}
                        create={isCreate}
                        item={item}
                    />
                )}
            </div>
            <hr/>
        </div>
    );
};

export default AddressContainer;
