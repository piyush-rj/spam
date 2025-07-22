import { test, describe, expect } from "bun:test";

const WS_URL = "ws://localhost:8080";

describe("chat app", () => {

    test("message sent from room 1 reaches another participant in room1", async () => {
        const ws1 = new WebSocket(WS_URL);
        const ws2 = new WebSocket(WS_URL);

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve();
                }
            }

            ws2.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve();
                }
            }
        })

        ws1.send(JSON.stringify({
            type: "JOIN",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "JOIN",
            room: "Room 1"
        }))

        await new Promise<void>((resolve) => {
            ws2.onmessage = ({data}) => {
                const parsedData = JSON.parse(data);

                expect(parsedData.type == "MESSAGE");
                expect(parsedData.type == "Hi there");
                resolve();
            }

            ws1.send(JSON.stringify({
                type: "MESSAGE",
                room: "Room1",
                message: "Hi there"
            }))
        })




    })


})