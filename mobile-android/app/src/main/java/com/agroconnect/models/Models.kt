package com.agroconnect.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Crop(
    @SerialName("crop_id") val cropId: Int,
    @SerialName("crop_name_en") val cropNameEn: String,
    @SerialName("name_localization") val nameLocalization: Map<String, String>? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
)

@Serializable
data class Mandi(
    @SerialName("mandi_id") val mandiId: Int,
    @SerialName("mandi_name") val mandiName: String,
    @SerialName("state_code") val stateCode: String,
    @SerialName("district_name") val districtName: String? = null,
    val latitude: Double,
    val longitude: Double,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
)

@Serializable
data class DailyMarketPrice(
    @SerialName("price_id") val priceId: Int? = null,
    @SerialName("crop_id") val cropId: Int,
    @SerialName("mandi_id") val mandiId: Int,
    val date: String,
    @SerialName("price_per_quintal") val pricePerQuintal: Double,
    @SerialName("created_at") val createdAt: String? = null,
)

@Serializable
data class Advisory(
    @SerialName("advisory_id") val advisoryId: Int,
    @SerialName("advisory_type") val advisoryType: String,
    @SerialName("crop_id") val cropId: Int? = null,
    @SerialName("state_scope") val stateScope: String? = null,
    @SerialName("title_en") val titleEn: String,
    @SerialName("content_en") val contentEn: String,
    val urgency: String,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("created_by") val createdBy: String? = null,
)

@Serializable
data class PredictionResponse(
    @SerialName("crop_id") val cropId: Int? = null,
    @SerialName("mandi_id") val mandiId: Int? = null,
    val predictions: List<PredictionDay> = emptyList(),
    @SerialName("confidence_score") val confidenceScore: Double = 0.0,
    @SerialName("trend_direction") val trendDirection: String = "STABLE",
    @SerialName("sell_window") val sellWindow: SellWindow? = null,
    @SerialName("historical_summary") val historicalSummary: HistoricalSummary? = null,
)

@Serializable
data class PredictionDay(
    @SerialName("forecast_day_index") val forecastDayIndex: Int,
    @SerialName("forecast_date") val forecastDate: String,
    @SerialName("predicted_price") val predictedPrice: Double,
    @SerialName("confidence_lower") val confidenceLower: Double? = null,
    @SerialName("confidence_upper") val confidenceUpper: Double? = null,
)

@Serializable
data class SellWindow(
    @SerialName("recommended_day") val recommendedDay: Int = 1,
    @SerialName("recommended_date") val recommendedDate: String = "",
    @SerialName("predicted_peak_price") val predictedPeakPrice: Double = 0.0,
    val reason: String = "",
)

@Serializable
data class HistoricalSummary(
    @SerialName("last_price") val lastPrice: Double = 0.0,
    @SerialName("ma_7day") val ma7Day: Double = 0.0,
    @SerialName("ma_14day") val ma14Day: Double = 0.0,
    val volatility: Double = 0.0,
    @SerialName("daily_trend") val dailyTrend: Double = 0.0,
)

@Serializable
data class WeatherResponse(
    val city: String = "",
    val daily: List<DailyWeather> = emptyList(),
    @SerialName("farming_advisories") val farmingAdvisories: List<String> = emptyList(),
)

@Serializable
data class DailyWeather(
    val date: String,
    @SerialName("temp_max") val tempMax: Double,
    @SerialName("temp_min") val tempMin: Double,
    @SerialName("temp_avg") val tempAvg: Double,
    @SerialName("humidity_avg") val humidityAvg: Int,
    @SerialName("total_precipitation_mm") val totalPrecipitationMm: Double,
    @SerialName("wind_avg_kph") val windAvgKph: Double,
    val condition: String,
    @SerialName("condition_desc") val conditionDesc: String,
)

@Serializable
data class UserProfile(
    @SerialName("user_id") val userId: String,
    @SerialName("first_name") val firstName: String,
    @SerialName("last_name") val lastName: String,
    @SerialName("phone_number") val phoneNumber: String? = null,
    @SerialName("user_type") val userType: String,
    @SerialName("current_language_code") val languageCode: String? = null,
)

interface LocationProfile {
    val userId: String
    val lat: Double?
    val lon: Double?
}

@Serializable
data class FarmerProfile(
    @SerialName("user_id") override val userId: String,
    @SerialName("primary_location_lat") override val lat: Double? = null,
    @SerialName("primary_location_lon") override val lon: Double? = null,
    @SerialName("farm_size_acres") val farmSize: Double? = null,
) : LocationProfile

@Serializable
data class BuyerProfile(
    @SerialName("user_id") override val userId: String,
    @SerialName("primary_location_lat") override val lat: Double? = null,
    @SerialName("primary_location_lon") override val lon: Double? = null,
) : LocationProfile

@Serializable
data class Listing(
    @SerialName("listing_id") val listingId: Long = 0,
    @SerialName("seller_user_id") val sellerUserId: String,
    @SerialName("item_type") val itemType: String = "CROP",
    @SerialName("crop_id") val cropId: Int? = null,
    @SerialName("equipment_details") val equipmentDetails: String? = null,
    val quantity: Double,
    @SerialName("unit_of_measure") val unitOfMeasure: String = "Quintal",
    @SerialName("listed_price") val listedPrice: Double,
    @SerialName("listing_status") val listingStatus: String = "ACTIVE",
    @SerialName("created_at") val createdAt: String? = null,
)

@Serializable
data class MarketTransaction(
    @SerialName("transaction_id") val transactionId: Long = 0,
    @SerialName("listing_id") val listingId: Long,
    @SerialName("buyer_user_id") val buyerUserId: String,
    @SerialName("agreed_quantity") val agreedQuantity: Double,
    @SerialName("agreed_price_total") val agreedPriceTotal: Double,
    @SerialName("escrow_status") val escrowStatus: String = "INITIATED",
    @SerialName("transaction_date") val transactionDate: String? = null,
)

@Serializable
data class CartItem(
    @SerialName("cart_id") val cartId: Long = 0,
    @SerialName("user_id") val userId: String,
    @SerialName("listing_id") val listingId: Long,
    val quantity: Double,
    @SerialName("added_at") val addedAt: String? = null,
)

@Serializable
data class CartItemWithDetails(
    val cartItem: CartItem,
    val listing: Listing,
    val cropName: String
)

@Serializable
data class Order(
    @SerialName("order_id") val orderId: Long = 0,
    @SerialName("buyer_user_id") val buyerUserId: String,
    @SerialName("total_amount") val totalAmount: Double,
    @SerialName("payment_status") val paymentStatus: String = "PENDING",
    @SerialName("order_status") val orderStatus: String = "PLACED",
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("updated_at") val updatedAt: String? = null,
)

@Serializable
data class OrderItem(
    @SerialName("item_id") val itemId: Long = 0,
    @SerialName("order_id") val orderId: Long,
    @SerialName("listing_id") val listingId: Long,
    val quantity: Double,
    @SerialName("price_per_unit") val pricePerUnit: Double,
    @SerialName("created_at") val createdAt: String? = null,
)

