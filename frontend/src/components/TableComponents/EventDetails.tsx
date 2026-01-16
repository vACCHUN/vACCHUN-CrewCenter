import React from "react";
import { VatsimEvent } from "../../types/events";
import EditModal from "../EditModal";
import EditModalHeader from "../EditModalHeader";
import Button from "../Button";

type EventDetailsParams = {
  event: VatsimEvent;
  message: string;
  closeModal: () => void;
};

function EventDetails({ event, message, closeModal }: EventDetailsParams) {
  return (
    <EditModal>
      <EditModalHeader>{event.name}</EditModalHeader>
      <div className="p-5">
        <p>{message}</p>
        <p className="mt-3">{event.description}</p>
        <div className="mt-3">
          <Button icon="close" text="Close" click={closeModal}></Button>
        </div>
      </div>
    </EditModal>
  );
}

export default EventDetails;
