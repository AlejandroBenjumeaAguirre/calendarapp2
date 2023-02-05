import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from '../';

import { getMessageES, localizer } from '../../helper';
import { useUiStore,useCalendarStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {

  const { user } = useAuthStore();
  const { openDateModal } = useUiStore(); 
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week' )

  const eventStyleGetter = ( event , start, end, isSelected ) => {

    const inMyEvent = ( user.id === event.user._id) ||  ( user.uid === event.user._id );

    const style = {
      backgroundColor: inMyEvent ? '#347cf7' : '#465660',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  const onDoubleClick =  () => {
    /* console.log({ doubleClick: event}); */

    openDateModal();
  }
  
  const onSelect = (event) => {
    /* console.log({ OnSelect: event}); */
    setActiveEvent( event );
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
  }

  useEffect(() => {
    startLoadingEvents()
  }, []);
  

  return (
    <>
      <Navbar />

      <Calendar
        culture='es'
        localizer={ localizer }
        events={ events }
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessageES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelect }
        onView={ onViewChanged }
      />

      <CalendarModal />
      
      <FabAddNew />

      <FabDelete />
    </>
  )
}
