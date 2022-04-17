export class MacroDeckButton{
    command_id: number;
    type: 'socket';
    description: string;
}

export class MqttButton{
    topic: string;
    payload: string;
    type: 'mqtt';
    description: string;
}

export class ApiCallButton{
    url: string;
    type: 'apiCall';
    description: string;
    fingerprint: string;
}