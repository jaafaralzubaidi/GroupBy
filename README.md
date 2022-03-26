# GroupBy 

### Using Express.js to create REST APIs for an app that lets people organize group events with data stored in database by using MongoDB.

## Users
The first thing you'll need for your app is a way to manage users. A user has the following attributes:
- id, a unique identifier for the user
- name, for display purposes
- joinedAt, the timestamp at which they joined the platform (i.e. when their record was created)
- interests, a list of strings that describe what they are interested in
- active, a boolean indicating whether the user has deactivated their account

### REST endpoints should allow the following:
- Creating a new user. At a minimum, you should accept a name, and assign an id and joinedAt.
- Getting the details of a specific user by id.
- Updating interests for a given user.
- Updating the active status of a given user.


## Groups
Groups let users interact with each other in a few different ways. A group has the following attributes:
- id, a unique identifier for the group
- name, for display purposes

### REST endpoints should allow the following:
- Listing all groups.
- Creating a new group. The request should include a name for the group and the id of the user creating the group. You should assign an id to the group and add the user who created the group as the first participant (see below about participants). 
- Getting the name of a specific group by id.

### Additionally, a group has the following collections:

## Participants
Each group has a list of ids for users who participate in the group. 

### REST endpoints should allow the following:
- Listing all users in the group.
- Adding a user to the group.
- Removing a user from the group.

## Messages
Each group has a list of messages sent by participants to the rest of the group. A message has the following attributes:
- userId, the id of the user who sent the message
- contents, a string containing the contents of the message
- postedAt, the timestamp of when the message was posted

### REST endpoints should allow the following:
- Listing all messages posted to the group.
- Posting a new message to the group.
- Replacing the contents of an existing message.


## Events
Users can schedule events for their groups. An event has the following attributes:
- createdBy, the id of the user who created the event
- event name, for display purposes
- startsAt, the timestamp of when the event starts
- endsAt, the timestamp of when the event ends

### REST endpoints should allow the following:
- Listing all events for a group.
- Creating a new event for a group.
- Getting the details of a specific event.
- Modifying anything other than createdBy.
- Deleting an event.