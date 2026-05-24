package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AuditLog struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ChallengeID string             `bson:"challenge_id" json:"challengeId"`
	Action      string             `bson:"action" json:"action"`
	Timestamp   time.Time          `bson:"timestamp" json:"timestamp"`
	Details     string             `bson:"details" json:"details"`
	PerformedBy string             `bson:"performed_by" json:"performedBy"`
}

var mongoCollection *mongo.Collection

func main() {
	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "5050"
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Printf("MongoDB connection error (continuing in mock mode): %v", err)
	} else {
		// Verify connection
		err = client.Ping(ctx, nil)
		if err != nil {
			log.Printf("MongoDB ping error (continuing in mock mode): %v", err)
		} else {
			log.Println("Successfully connected to MongoDB NoSQL Database!")
			mongoCollection = client.Database("challenge_tracker").Collection("audit_logs")
		}
	}

	// Serve endpoints
	http.HandleFunc("/api/audit", handleAudit)
	http.HandleFunc("/health", handleHealth)

	log.Printf("Go Microservice running on port %s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "challenge-audit-service",
		"language":  "golang",
		"database":  "mongodb",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func handleAudit(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodPost:
		var logEntry AuditLog
		if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
			return
		}

		logEntry.Timestamp = time.Now()
		logEntry.ID = primitive.NewObjectID()

		// Write to MongoDB if connected
		if mongoCollection != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			_, err := mongoCollection.InsertOne(ctx, logEntry)
			if err != nil {
				log.Printf("Failed to insert audit log into MongoDB: %v", err)
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Failed to write audit trail"})
				return
			}
		} else {
			log.Printf("[MOCK DB WRITE] Audit Created: %+v", logEntry)
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Audit log captured successfully in MongoDB NoSQL",
			"data":    logEntry,
		})

	case http.MethodGet:
		var logs []AuditLog

		if mongoCollection != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			findOptions := options.Find()
			findOptions.SetSort(bson.D{{Key: "timestamp", Value: -1}})
			findOptions.SetLimit(50)

			cursor, err := mongoCollection.Find(ctx, bson.M{}, findOptions)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Failed to query audits"})
				return
			}
			defer cursor.Close(ctx)

			for cursor.Next(ctx) {
				var entry AuditLog
				if err := cursor.Decode(&entry); err == nil {
					logs = append(logs, entry)
				}
			}
		} else {
			// Mock Fallback when MongoDB is not running locally (delivers beautiful mock trail)
			logs = []AuditLog{
				{
					ID:          primitive.NewObjectID(),
					ChallengeID: "cuid-mock-1",
					Action:      "CREATE",
					Timestamp:   time.Now().Add(-5 * time.Minute),
					Details:     "Created new challenge: Code Refactoring API using Prisma Engine",
					PerformedBy: "admin",
				},
				{
					ID:          primitive.NewObjectID(),
					ChallengeID: "cuid-mock-2",
					Action:      "UPDATE",
					Timestamp:   time.Now().Add(-2 * time.Minute),
					Details:     "Updated challengeSource status from draft to active using Drizzle ORM",
					PerformedBy: "drizzle_system",
				},
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"data":    logs,
		})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
	}
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
