import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Collections } from '../constants/collections.constants';
import { Mail, Message } from '../models/mail.model';
import { UserData } from '../models/user-data.model';
import { Booking } from '../models/booking-details.model';
import { ClinicServiceData } from '../models/clinic-service-data.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private mailCollection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore) { 
    this.mailCollection = collection(this._fireStore, Collections.MAIL);
  }

  sendEmail(mail: Mail){
    if(!environment.emailEnabled) return null;

    return addDoc(this.mailCollection, mail);
  }

  buildMail(emailRecipients: string[], messageBody: Message): Mail{
    return {
      to: [...emailRecipients],
      message: messageBody
    };
  }

  buildBookingConfirmationEmailMessage(userData: UserData, booking: Booking): Message{
    const subject = `BOOKING CONFIRMATION`;
    const recipient = `Hi ${userData?.person?.firstName || 'Patient'},` ;

    const mainMessage = this.composeBookingConfirmationMessage(booking);

    return { subject, html: this.buildBodyFromTemplate(recipient, mainMessage) };
  }

  buildReschedulingConfirmationEmailMessage(userData: UserData, booking: Booking): Message{
    const subject = `BOOKING RESCHEDULE CONFIRMATION`;
    const recipient = `Hi ${userData?.person?.firstName || 'Patient'},` ;

    const mainMessage = this.composeRescheduleConfirmationMessage(booking);

    return { subject, html: this.buildBodyFromTemplate(recipient, mainMessage) };
  }

  composeBookingConfirmationMessage(booking: Booking): string{
   return `
    This is to confirm your booking with clinic ${booking.clinic?.name}:
    <br>
    <br>
    <h3>Booking Details:</h3>
    <ul>
      <li>Booking No.: ${booking.bookingNo}</li>
      <li>Booking Date: ${booking.bookingDate.toDateString()}</li>
      <li>Booking Status: ${booking.bookingStatus}</li>
      <li>Remarks: ${booking.remarks}</li>
    </ul>
    <br>
    Services:
    ${this.composeClinicServices(booking.clinicServices!)} 
    <br>
    <br>
    Thank you for booking with us. If you need anything else related to your booking, feel free to ask our team.
    <br>
    <br>
    Keep enjoying our services!
   `;
  }

  composeRescheduleConfirmationMessage(booking: Booking): string{
   return `
    This is to inform you about the new booking schedule with clinic ${booking.clinic?.name}:
    <br>
    <br>
    <h3>Booking Details:</h3>
    <ul>
      <li>Booking No.: ${booking.bookingNo}</li>
      <li>Booking Date: ${booking.bookingDate.toDateString()}</li>
      <li>Booking Status: ${booking.bookingStatus}</li>
      <li>Remarks: ${booking.remarks}</li>
    </ul>
    <br>
    Services:
    ${this.composeClinicServices(booking.clinicServices!)} 
    <br>
    <br>
    Thank you for booking with us. If you need anything else related to your booking, feel free to ask our team.
    <br>
    <br>
    Keep enjoying our services!
   `;
  }

  composeClinicServices(clinicServices: ClinicServiceData[]){
    let clinicServicesList = '';
    clinicServices.forEach(clinicService => {
      clinicServicesList += `<li>${clinicService.name}</li>`
    });

    return `
      <ul style="list-style-type: disc; margin-left: 20px;">
        ${clinicServicesList}
      </ul>
    `;
  }

  buildBodyFromTemplate(recipient: string, mainMessage: string){
    const signatureName = environment.emailSignatureName;

    const html = `
      <p>
        ${recipient},
        <br>
        <br>
        ${mainMessage}
      </p>

      <br>
      <br>
      <br>
      Regards,
      <br>
      ${signatureName}
    `;

    return html;
  }
}
