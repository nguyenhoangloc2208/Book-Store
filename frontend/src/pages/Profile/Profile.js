import React, { useEffect, useState } from "react";
import '../../assets/styles/Profile.scss';
import useSWR, { mutate } from "swr";
import api from '../../services/api';
import OrderHistory from "./OrderHistory";
import AddressContainer from "../../components/ui/AddressContainer";
import Loading from "../../components/ui/Loading";

const fetcher = (url) => api.get(url).then(res => res);
const fetcherAddress = (url) => api.get(url).then(res => res.results);


const Profile = () =>{
    const {data, error, isLoading} = useSWR('/api/user/profile/', fetcher, {refreshInterval: 300000, revalidateOnFocus: false})
    const {data: address, error: addressError, isLoading: addressLoading} = useSWR('/api/user/profile/address/', fetcherAddress, {refreshInterval: null, revalidateOnFocus: false});
    const [tab, setTab] = useState(0);

    if (error || addressError) return <div>failed to load...</div>
    if (isLoading || addressLoading) return <div><Loading/></div>
    

    return(
        <>
            <div class="parent">
                <div class="div1">
                    <ul className="canvas">
                        <li onClick={() => setTab(0)} className={tab === 0 && 'tab'}><i class="fa-solid fa-user"></i> Profile</li>
                        <li onClick={() => setTab(1)} className={tab === 1 && 'tab'}><i class="fa-solid fa-receipt"></i> History</li>
                        <li onClick={() => setTab(2)} className={tab === 2 && 'tab'}><i class="fa-solid fa-gear"></i> Account</li>
                    </ul>
                </div>
                <div class="div2">
                    {tab === 0 &&  <div className="profile">
                        <div className="avatar-container">
                            <div className="circle">
                                {data.profile && data.profile.avatar ?
                                    <img src={data.profile.avatar} alt="avatar"/>
                                    :
                                    <img src="https://i.pravatar.cc/300" alt="avatar" />
                                }
                            </div>
                            <div className="info">
                                <div>{data.last_name}&nbsp;{data.first_name}</div>
                                <div>{data.email}</div>
                            </div>
                        </div>
                        <hr/>
                        <AddressContainer
                            address={address}
                        />
                    </div>}
                    {tab === 1 &&
                    <OrderHistory/>}
                </div>
            </div>
        </>
    )
}

export default Profile;