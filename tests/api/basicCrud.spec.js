import { test, expect } from '@playwright/test';

const baseURL = 'https://restful-booker.herokuapp.com';

test('Full Booking CRUD Flow', async ({ request }) => {

    // 1️⃣ Create Booking
    const createResponse = await request.post(`${baseURL}/booking`, {
        data: {
            firstname: "Ram",
            lastname: "Sham",
            totalprice: 99850,
            depositpaid: true,
            bookingdates: {
                checkin: "2028-03-10",
                checkout: "2028-03-15"
            },
            additionalneeds: "Gym Membership"
        }
    });

    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;

    console.log("Booking ID:", bookingId);

    // 2️⃣ Generate Token
    const authResponse = await request.post(`${baseURL}/auth`, {
        data: {
            username: "admin",
            password: "password123"
        }
    });

    expect(authResponse.status()).toBe(200);

    const authBody = await authResponse.json();
    const token = authBody.token;

    console.log("Token:", token);

    // 3️⃣ Update Booking
    const updateResponse = await request.put(`${baseURL}/booking/${bookingId}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${token}`
        },
        data: {
            firstname: "Updated Ram",
            lastname: "Updated Shyam",
            totalprice: 898,
            depositpaid: true,
            bookingdates: {
                checkin: "2029-03-12",
                checkout: "2029-03-18"
            },
            additionalneeds: "Dinner Updated"
        }
    });

    expect(updateResponse.status()).toBe(200);

    // 4️⃣ Validate Update
    const getResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    expect(getBody.firstname).toBe("Updated Ram");
    expect(getBody.totalprice).toBe(898);
    expect(getBody.depositpaid).toBe(true);

    // 5️⃣ Delete Booking
    const deleteResponse = await request.delete(`${baseURL}/booking/${bookingId}`, {
        headers: {
            "Cookie": `token=${token}`
        }
    });

    expect(deleteResponse.status()).toBe(201);

    // 6️⃣ Validate Deletion
    const finalGet = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(finalGet.status()).toBe(404);
});
