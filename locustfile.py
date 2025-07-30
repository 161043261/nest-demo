from locust import HttpUser, task, between

# python.analysis.typeCheckingMode


class BenchmarkUser(HttpUser):
    wait_time = between(1, 2)

    def login_create(self):
        self.client.post("/login", json={"name": "whoami", "age": 23})

    @task
    def login_find(self):
        # findAll
        self.client.get("/login?role=admin")
        # findOne
        self.client.get("/login/1?role=user")

    @task(3)
    def user_remove_v1(self):
        for user_id in range(10):
            self.client.delete(f"/v1/user/id={user_id}", name="/.cache")
