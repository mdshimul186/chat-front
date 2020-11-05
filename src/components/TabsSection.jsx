import React,{useEffect,useState} from 'react'

import Rooms from './Rooms'
import SearchUser from './SearchUser'




function TabsSection() {
   
    const [Tab, setTab] = useState('room')
  
    
       
        
    return (
        <div>
            <div className="tab_head">
                <div onClick={()=>setTab("room")} className="tab_head_group">
                    <i class="far fa-comment-dots"></i>
                    <span>Rooms</span>
                </div>

                <div onClick={()=>setTab("search")} className="tab_head_group">
                    <i class="fas fa-search"></i>
                    <span>Search</span>
                </div>

                <div onClick={()=>setTab("favourite")} className="tab_head_group">
                    <i class="far fa-star"></i>
                    <span>Favourites</span>
                </div>

                <div onClick={()=>setTab("meeting")} className="tab_head_group">
                    <i class="fas fa-users"></i>
                    <span>Meetings</span>
                </div>
            </div>

            <div className="contact_list_container">
                    {
                        Tab === 'room' && <Rooms />
                    }

                    {
                        Tab === 'search' && <SearchUser  />
                    }
                

                
                
                


            </div>
        </div>
    )
}

export default TabsSection
