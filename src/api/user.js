 import { APIResource, buildURL } from './resource.js';

export function register({ username, firstname, lastname, password, email })
{
    return new APIResource(buildURL('/users')).post(
        { username: username, firstname: firstname, lastname: lastname, password: password, email: email, admin: 0}
    );
}

export function updateProfile(id, { username, firstname, lastname, password, email })
{
    return new APIResource(buildURL(`/users/${id}`)).put( {firstname, lastname, password, email } )
}

export function getProfile(id)
{
    return new APIResource(buildURL(`/users/${id}`)).get();
}

export function listusers({page})
{   
    const thispage = page;
    return new APIResource(buildURL(`/users?page=${thispage}`)).get()
}

