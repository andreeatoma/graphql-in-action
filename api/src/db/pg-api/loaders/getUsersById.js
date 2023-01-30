import { convertArrayToObjectById } from '../../../utils';

export function getUsersById(query) {
  return async (ids) => {
    const response = await query(statement, { $1: ids });
    const users = convertArrayToObjectById(response.rows);

    return ids.map((id) => users[id]);
  };
}

const statement = `
  SELECT id, username, first_name AS "firstName", last_name AS "lastName",          created_at AS "createdAt"
  FROM azdev.users
  WHERE id = ANY ($1)
`;
