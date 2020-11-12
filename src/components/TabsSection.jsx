import React,{useEffect,useState} from 'react'
import Favourites from './Favourites'

import Rooms from './Rooms'
import SearchUser from './SearchUser'





function TabsSection() {
   
    const [Tab, setTab] = useState('room')
  
    
       
        
    return (
        <div>
            <div className="tab_head">
                <div  onClick={()=>setTab("room")} className={Tab === 'room' ? 'tab_head_group active':'tab_head_group '} >
                    <i class="far fa-comment-dots"></i>
                    <span>Rooms</span>
                </div>

                <div onClick={()=>setTab("search")} className={Tab === 'search' ? 'tab_head_group active':'tab_head_group '}>
                    <i class="fas fa-search"></i>
                    <span>Search</span>
                </div>

                <div onClick={()=>setTab("favourite")} className={Tab === 'favourite' ? 'tab_head_group active':'tab_head_group '}>
                    <i class="far fa-star"></i>
                    <span>Favourites</span>
                </div>

                <div onClick={()=>setTab("meeting")} className={Tab === 'meeting' ? 'tab_head_group active':'tab_head_group '}>
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
                    {
                        Tab === 'favourite' && <Favourites />
                    }
                    {
                        Tab === 'meeting' && <p style={{textAlign:"center"}}>Comming soon</p>
                    }

                
                
                


            </div>
        </div>
    )
}

export default TabsSection
