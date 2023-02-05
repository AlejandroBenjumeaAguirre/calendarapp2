import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from "../store";
import { convertEventsToDateEvents } from "../helper";
import Swal from "sweetalert2";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
      dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {

      try {

        if( calendarEvent.id ){
          // Actualizando
          await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent );
          
          dispatch( onUpdateEvent( { ...calendarEvent, user } ) );
          return;
        } 
          // Creando
        const { data } = await calendarApi.post('/events', calendarEvent );
        
        dispatch( onAddNewEvent({ ...calendarEvent, id: data.eventSave.id, user }) );
        
      } catch (error) {
        console.log(error);
        Swal.fire('Error al guardar', error.response.data?.msg, 'error');
      }

    }

    const startDeletingEvent = async() => {

      try {

        if(activeEvent.id){
          const { data } = await calendarApi.delete(`/events/${activeEvent.id}`);

          dispatch( onDeleteEvent() );
          return;
        }

      } catch (error) {
        console.log(error);
        Swal.fire('Error al eliminar', error.response.data?.msg, 'error');
      }
    }

    const startLoadingEvents = async() => {
      try {
        const { data } = await calendarApi.get('/events');
        const events = convertEventsToDateEvents( data.events );
        dispatch( onLoadEvents( events ) );
      } catch (error) {
        console.log('Error cargando eventos');
        console.log(error);
      }
    }

  return {
    // Propedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // Metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  }
}
