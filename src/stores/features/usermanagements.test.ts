// userslice.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, {
  Fetchuser,
  Adduser,
  Deleteuser,
  Edituser,
  ChangeRole,
  ChangeStatus,
  clearMessages,
} from './usermangement'; // Adjust path if needed

// Mock the API service functions from the correct path
import * as userService from '../../services/authser';

vi.mock('../../services/authser', () => ({
  getusers: vi.fn(),
  adduser: vi.fn(),
  deleteuser: vi.fn(),
  edituser: vi.fn(),
  changestatus: vi.fn(),
  changerole: vi.fn(),
}));

// Helper user objects for tests
const sampleUser = {
  _id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  status: 'active',
  createdAt: '2025-05-21',
};

const dummyUser = {
  _id: '1',
  name: 'John',
  email: 'john@example.com',
  role: 'user',
  status: 'active',
  createdAt: '2025-01-01',
};

describe('UserManagement Slice', () => {
  const initialState = {
    users: [],
    loading: false,
    error: null,
    message: null,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });
describe('Async thunk tests with mocked API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Fetchuser
  it('Fetchuser success', async () => {
    (userService.getusers as unknown as vi.Mock).mockResolvedValue([dummyUser]);

    const action = Fetchuser();
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.getusers).toHaveBeenCalled();
    expect(result.payload).toEqual([dummyUser]);
  });

  it('Fetchuser failure', async () => {
    const errorMsg = 'Failed to fetch';
    (userService.getusers as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const action = Fetchuser();
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.getusers).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/Fetchuser/rejected');
  });

  // Adduser
  it('Adduser success', async () => {
    const response = { _id: '2', ...dummyUser, message: 'Added!' };
    (userService.adduser as unknown as vi.Mock).mockResolvedValue(response);

    const action = Adduser(dummyUser);
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.adduser).toHaveBeenCalledWith(dummyUser);
    // Adjusted according to how your thunk returns payload structure
    expect(result.payload?.data).toEqual(response);
    expect(result.payload?.message).toBe('Added!');
  });

  it('Adduser failure', async () => {
    const errorMsg = 'Add failed';
    (userService.adduser as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const action = Adduser(dummyUser);
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.adduser).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/Adduser/rejected');
  });

  // Deleteuser
  it('Deleteuser success', async () => {
    const response = { _id: dummyUser._id, message: 'Deleted!' };
    (userService.deleteuser as unknown as vi.Mock).mockResolvedValue(response);

    const action = Deleteuser(dummyUser._id);
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.deleteuser).toHaveBeenCalledWith(dummyUser._id);
    expect(result.payload?.data).toEqual(response);
    expect(result.payload?.message).toBe('Deleted!');
  });

  it('Deleteuser failure', async () => {
    const errorMsg = 'Delete failed';
    (userService.deleteuser as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const action = Deleteuser(dummyUser._id);
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.deleteuser).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/Deleteuser/rejected');
  });

  // Edituser
  it('Edituser success', async () => {
    const updatedUser = { ...dummyUser, name: 'Jane', message: 'Updated!' };
    (userService.edituser as unknown as vi.Mock).mockResolvedValue(updatedUser);

    const userData = { name: 'Jane', email: dummyUser.email, role: dummyUser.role, status: dummyUser.status };
    const action = Edituser({ id: dummyUser._id, userData });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.edituser).toHaveBeenCalledWith(dummyUser._id, userData);
    expect(result.payload?.data).toEqual(updatedUser);
    expect(result.payload?.message).toBe('Updated!');
  });

  it('Edituser failure', async () => {
    const errorMsg = 'Edit failed';
    (userService.edituser as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const userData = { name: 'Jane', email: dummyUser.email, role: dummyUser.role, status: dummyUser.status };
    const action = Edituser({ id: dummyUser._id, userData });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.edituser).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/Edituser/rejected');
  });

  // ChangeRole
  it('ChangeRole success', async () => {
    const updatedUser = { ...dummyUser, role: 'admin', message: 'Role updated!' };
    (userService.changerole as unknown as vi.Mock).mockResolvedValue(updatedUser);

    const action = ChangeRole({ id: dummyUser._id, role: 'admin' });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.changerole).toHaveBeenCalledWith(dummyUser._id, 'admin');
    expect(result.payload?.data).toEqual(updatedUser);
    expect(result.payload?.message).toBe('Role updated!');
  });

  it('ChangeRole failure', async () => {
    const errorMsg = 'Role change failed';
    (userService.changerole as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const action = ChangeRole({ id: dummyUser._id, role: 'admin' });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.changerole).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/ChangeRole/rejected');
  });

  // ChangeStatus
  it('ChangeStatus success', async () => {
    const updatedUser = { ...dummyUser, status: 'inactive', message: 'Status updated!' };
    (userService.changestatus as unknown as vi.Mock).mockResolvedValue(updatedUser);

    const action = ChangeStatus({ id: dummyUser._id, status: 'inactive' });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.changestatus).toHaveBeenCalledWith(dummyUser._id, 'inactive');
    expect(result.payload?.data).toEqual(updatedUser);
    expect(result.payload?.message).toBe('Status updated!');
  });

  it('ChangeStatus failure', async () => {
    const errorMsg = 'Status change failed';
    (userService.changestatus as unknown as vi.Mock).mockRejectedValue({
      response: { data: { message: errorMsg } }
    });

    const action = ChangeStatus({ id: dummyUser._id, status: 'inactive' });
    const dispatch = vi.fn();
    const result = await action(dispatch, () => {}, undefined);

    expect(userService.changestatus).toHaveBeenCalled();
    expect(result.payload).toBe(errorMsg);
    expect(result.type).toBe('users/ChangeStatus/rejected');
  });
});

  // Reducer tests
  describe('Reducer', () => {
    // Fetchuser reducer
    describe('Fetchuser', () => {
      it('handles fulfilled', () => {
        const action = {
          type: Fetchuser.fulfilled.type,
          payload: [sampleUser],
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.users).toEqual([sampleUser]);
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: Fetchuser.rejected.type,
          payload: 'Fetch error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Fetch error');
      });

      it('handles pending', () => {
        const action = { type: Fetchuser.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // Adduser reducer
    describe('Adduser', () => {
      it('handles fulfilled', () => {
        const action = {
          type: Adduser.fulfilled.type,
          payload: {
            data: sampleUser,
            message: 'User added',
          },
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.users).toEqual([sampleUser]);
        expect(state.message).toBe('User added');
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: Adduser.rejected.type,
          payload: 'Add error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Add error');
      });

      it('handles pending', () => {
        const action = { type: Adduser.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // Deleteuser reducer
    describe('Deleteuser', () => {
      const stateWithUsers = { ...initialState, users: [sampleUser] };

      it('handles fulfilled', () => {
        const action = {
          type: Deleteuser.fulfilled.type,
          payload: {
            data: sampleUser,
            message: 'Deleted',
          },
        };
        const state = reducer(stateWithUsers, action);
        expect(state.loading).toBe(false);
        expect(state.users).toEqual([]); // user removed
        expect(state.message).toBe('Deleted');
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: Deleteuser.rejected.type,
          payload: 'Delete error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Delete error');
      });

      it('handles pending', () => {
        const action = { type: Deleteuser.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // Edituser reducer
    describe('Edituser', () => {
      const stateWithUsers = { ...initialState, users: [sampleUser] };

      it('handles fulfilled', () => {
        const editedUser = { ...sampleUser, name: 'Jane' };
        const action = {
          type: Edituser.fulfilled.type,
          payload: {
            data: editedUser,
            message: 'Edited',
          },
        };
        const state = reducer(stateWithUsers, action);
        expect(state.loading).toBe(false);
        expect(state.users[0].name).toBe('Jane');
        expect(state.message).toBe('Edited');
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: Edituser.rejected.type,
          payload: 'Edit error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Edit error');
      });

      it('handles pending', () => {
        const action = { type: Edituser.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // ChangeRole reducer
    describe('ChangeRole', () => {
      const stateWithUsers = { ...initialState, users: [sampleUser] };

      it('handles fulfilled', () => {
        const updatedUser = { ...sampleUser, role: 'admin' };
        const action = {
          type: ChangeRole.fulfilled.type,
          payload: {
            data: updatedUser,
            message: 'Role changed',
          },
        };
        const state = reducer(stateWithUsers, action);
        expect(state.loading).toBe(false);
        expect(state.users[0].role).toBe('admin');
        expect(state.message).toBe('Role changed');
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: ChangeRole.rejected.type,
          payload: 'Change role error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Change role error');
      });

      it('handles pending', () => {
        const action = { type: ChangeRole.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // ChangeStatus reducer
    describe('ChangeStatus', () => {
      const stateWithUsers = { ...initialState, users: [sampleUser] };

      it('handles fulfilled', () => {
        const updatedUser = { ...sampleUser, status: 'inactive' };
        const action = {
          type: ChangeStatus.fulfilled.type,
          payload: {
            data: updatedUser,
            message: 'Status changed',
          },
        };
        const state = reducer(stateWithUsers, action);
        expect(state.loading).toBe(false);
        expect(state.users[0].status).toBe('inactive');
        expect(state.message).toBe('Status changed');
        expect(state.error).toBeNull();
      });

      it('handles rejected', () => {
        const action = {
          type: ChangeStatus.rejected.type,
          payload: 'Change status error',
        };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Change status error');
      });

      it('handles pending', () => {
        const action = { type: ChangeStatus.pending.type };
        const state = reducer(initialState, action);
        expect(state.loading).toBe(true);
      });
    });

    // clearMessages reducer
    it('clearMessages resets message and error', () => {
      const stateWithMessages = {
        ...initialState,
        message: 'Some message',
        error: 'Some error',
      };
      const state = reducer(stateWithMessages, clearMessages());
      expect(state.message).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
