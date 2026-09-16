import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'; // for dateClick

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('externalEvents', {static: true}) externalEvents: ElementRef;

  // Calendar Event Source
  exampleEvents = [
    {
      id: '1',
      start: this.yearMonth+'-08T08:30:00',
      end: this.yearMonth+'-08T13:00:00',
      title: 'Google Developers Meetup',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    },{
      id: '2',
      start: this.yearMonth+'-10T09:00:00',
      end: this.yearMonth+'-10T17:00:00',
      title: 'Design/Code Review',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    },{
      id: '3',
      start: this.yearMonth+'-13T12:00:00',
      end: this.yearMonth+'-13T18:00:00',
      title: 'Lifestyle Conference',
      description: 'Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    },{
      id: '4',
      start: this.yearMonth+'-15T07:30:00',
      end: this.yearMonth+'-15T15:30:00',
      title: 'Team Weekly Trip',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    },{
      id: '5',
      start: this.yearMonth+'-17T10:00:00',
      end: this.yearMonth+'-19T15:00:00',
      title: 'DJ Festival',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    },{
      id: '6',
      start: this.yearMonth+'-08T13:00:00',
      end: this.yearMonth+'-08T18:30:00',
      title: 'Carl Henson\'s Wedding',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(1,104,250, .15)',
      borderColor: '#0168fa'
    }
  ];

  birthdayEvents= [
    {
      id: '7',
      start: this.yearMonth+'-01T18:00:00',
      end: this.yearMonth+'-01T23:30:00',
      title: 'Jensen Birthday',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(16,183,89, .25)',
      borderColor: '#10b759'
    },
    {
      id: '8',
      start: this.yearMonth+'-21T15:00:00',
      end: this.yearMonth+'-21T21:00:00',
      title: 'Carl\'s Birthday',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(16,183,89, .25)',
      borderColor: '#10b759'
    },
    {
      id: '9',
      start: this.yearMonth+'-23T15:00:00',
      end: this.yearMonth+'-23T21:00:00',
      title: 'Yaretzi\'s Birthday',
      description: 'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis az pede mollis...',
      backgroundColor: 'rgba(16,183,89, .25)',
      borderColor: '#10b759'
    }
  ];

  holidayEvents= [
    {
      id: '10',
      start: this.yearMonth+'-04',
      end: this.yearMonth+'-06',
      title: 'Feast Day',
      backgroundColor: 'rgba(241,0,117,.25)',
      borderColor: '#f10075'
    },
    {
      id: '11',
      start: this.yearMonth+'-26',
      end: this.yearMonth+'-27',
      title: 'Memorial Day',
      backgroundColor: 'rgba(241,0,117,.25)',
      borderColor: '#f10075'
    },
    {
      id: '12',
      start: this.yearMonth+'-28',
      end: this.yearMonth+'-29',
      title: 'Veteran\'s Day',
      backgroundColor: 'rgba(241,0,117,.25)',
      borderColor: '#f10075'
    }
  ];

  discoveredEvents= [
    {
      id: '13',
      start: this.yearMonth+'-17T08:00:00',
      end: this.yearMonth+'-18T11:00:00',
      title: 'Web Design Workshop Seminar',
      backgroundColor: 'rgba(0,204,204,.25)',
      borderColor: '#00cccc'
    }
  ];

  meetupEvents= [
    {
      id: '14',
      start: this.yearMonth+'-03',
      end: this.yearMonth+'-05',
      title: 'UI/UX Meetup Conference',
      backgroundColor: 'rgba(91,71,251,.2)',
      borderColor: '#5b47fb'
    },
    {
      id: '15',
      start: this.yearMonth+'-18',
      end: this.yearMonth+'-20',
      title: 'Angular Conference Meetup',
      backgroundColor: 'rgba(91,71,251,.2)',
      borderColor: '#5b47fb'
    }
  ];

  otherEvents= [
    {
      id: '16',
      start: this.yearMonth+'-06',
      end: this.yearMonth+'-08',
      title: 'My Rest Day',
      backgroundColor: 'rgba(253,126,20,.25)',
      borderColor: '#fd7e14'
    },
    {
      id: '17',
      start: this.yearMonth+'-29',
      end: this.yearMonth+'-31',
      title: 'My Rest Day',
      backgroundColor: 'rgba(253,126,20,.25)',
      borderColor: '#fd7e14'
    }
  ];

  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarEvents: EventInput[] = [ ...this.exampleEvents, ...this.birthdayEvents, ...this.holidayEvents, ...this.discoveredEvents, ...this.meetupEvents, ...this.otherEvents];
  handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay
      })
    }
  }

  constructor() { }

  ngOnInit(): void {

    // For external-events dragging
    new Draggable(this.externalEvents.nativeElement, {
      itemSelector: '.fc-event',
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText,
          backgroundColor: eventEl.getAttribute('bgColor'),
          borderColor: eventEl.getAttribute('bdColor')
        };
      }
    });

  }

  get yearMonth(): string {
    const dateObj = new Date();
    if(dateObj.getUTCMonth() < 10) {
      return dateObj.getUTCFullYear() + '-' + ('0'+(dateObj.getUTCMonth() + 1));
    } else {
      return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    }
  }

}
