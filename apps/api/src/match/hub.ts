import type { WebSocket } from 'ws';
import { loadRoomSnapshot, personalizeState } from './service.js';

/**
 * Open sockets per room, kept in memory. Fine for a single API instance;
 * scaling horizontally would need a shared pub/sub (e.g. Redis) here.
 */
const rooms = new Map<string, Map<WebSocket, string>>();

export function addConnection(code: string, socket: WebSocket, participantId: string) {
  const sockets = rooms.get(code) ?? new Map<WebSocket, string>();
  sockets.set(socket, participantId);
  rooms.set(code, sockets);
}

export function removeConnection(code: string, socket: WebSocket) {
  const sockets = rooms.get(code);
  if (!sockets) return;
  sockets.delete(socket);
  if (sockets.size === 0) rooms.delete(code);
}

function onlineParticipants(code: string): Set<string> {
  return new Set(rooms.get(code)?.values() ?? []);
}

export function send(socket: WebSocket, message: unknown) {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
}

/** Pushes each connected participant their own view of the room. */
export async function broadcastRoom(code: string) {
  const sockets = rooms.get(code);
  if (!sockets?.size) return;

  const snapshot = await loadRoomSnapshot(code);
  if (!snapshot) return;
  const online = onlineParticipants(code);

  for (const [socket, participantId] of sockets) {
    const state = personalizeState(snapshot, participantId, online);
    if (state) send(socket, { type: 'state', state });
  }
}
