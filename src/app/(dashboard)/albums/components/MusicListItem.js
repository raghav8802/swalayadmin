// import React from 'react'
// import Style from '../../../styles/MusicListItem.module.css'
// import Link from 'next/link'

// const MusicListItem = ({ srno = 1, albumName, singer, totalTrack, status }) => {
//     return (
//         <div className={Style.musicItem}>
//             <ul>
//                 <li><span className={`mr-2 ${Style.sno}`}># {srno} </span>
//                     <Link className={Style.albumLink} href='/albums/viewalbum'>{albumName}</Link></li>
//                 <li className='ml-2'><i className="bi bi-person mr-2"></i> {singer}</li>
//                 <li className='ml-2'><i className="bi bi-music-note-beamed mr-2"></i> {totalTrack}</li>

//                 {/* <li className='ml-2'> <span className={Style.approvedStatus}>Status</span></li> */}

//                 <li className='ml-2'>
//                     <span
//                         className={
//                             status === 'submitted' ? Style.submitedStatus
//                                 : status === 'processing' ? Style.processingStatus
//                                     : status === 'rejected' ? Style.rejectedStatus
//                                         : status === 'live' ? Style.liveStatus
//                                             : ''
//                         }
//                     >
//                         {status}
//                     </span>
//                 </li>

//                 <li className='ml-2'><i className="bi bi-info-circle-fill mr-2"></i> Details</li>
//             </ul>
//         </div>
//     )
// }

// export default MusicListItem