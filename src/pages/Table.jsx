import  { useState,useEffect,useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import "../styles/table.css"
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';

const EVENT_ENDPOINTS = {
  completed: '/calendar/event/completed_events',
  running: '/calendar/event/running_events',
  upcoming: '/calendar/event/upcoming_events'
};
const Table = () => {
  // Memoized columns definition
  const { eventType } = useParams();
    // State to manage events and loading
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      const fetchEvents = async () => {
        if (!eventType || !EVENT_ENDPOINTS[eventType]) {
          setError('Invalid event type');
          setIsLoading(false);
          return;
        }
    
        const baseUrl = import.meta.env.VITE_APP_BASE_URL;
        const headers = {
          Authorization: `Token ${sessionStorage.getItem('token')}`,
        };
    
        try {
          setIsLoading(true);
          const response = await axios.get(`${baseUrl}${EVENT_ENDPOINTS[eventType]}`, { headers });
          const transformedData = response.data.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            startTime: event.start_time,
            endTime: event.end_time,
          }));
          setEvents(transformedData);
          console.log(events)
          setError(null);
        } catch (err) {
          setError('Failed to fetch events');
          setEvents([]);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchEvents();
    }, [eventType]);
    
    const columns = useMemo(
      () => [
        {
          accessorKey: 'id',
          header: 'ID',
          size: 100,
        },
        {
          accessorKey: 'title',
          header: 'Title',
          size: 200,
        },
        {
          accessorKey: 'description',
          header: 'Description',
          size: 300,
        },
        {
          accessorKey: 'startTime',
          header: 'Start Time',
          size: 200,
          Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
        },
        {
          accessorKey: 'endTime',
          header: 'End Time',
          size: 200,
          Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
        },
      ],
      []
    );

  // Create table instance
  const table = useMaterialReactTable({
    columns,
    data:events,
    // Optional: add some additional configuration
    initialState: { 
      sorting: [{ id: 'id', desc: false }],
      density: 'compact'
    },
  });

  useEffect(()=>console.log(events),[events])
  
  if(error){
    window.alert(error)
    return;
  }
  return(
  <div className='table-container'>
    <h1 className='table-heading'>{eventType === 'running' ? ('Running Events') : eventType === 'upcoming' ? ('Upcoming Events') : ('Completed Events')} </h1>
    {isLoading  ? (<Loader/>) : (
      <MaterialReactTable table={table}/>)}
    
  </div>
  )
};

export default Table;