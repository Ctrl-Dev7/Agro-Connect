package com.agroconnect.ui.screens

import android.util.Log
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.agroconnect.data.AgroRepository
import com.agroconnect.data.SupabaseClient
import com.agroconnect.models.Advisory
import com.agroconnect.ui.theme.*
import io.github.jan.supabase.gotrue.auth
import kotlinx.coroutines.launch

@Composable
fun AdvisoriesScreen() {
    val scope = rememberCoroutineScope()
    var advisories by remember { mutableStateOf<List<Advisory>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var expandedId by remember { mutableIntStateOf(-1) }
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Farming Tips", "Gov Schemes")

    LaunchedEffect(selectedTab) {
        loading = true
        scope.launch {
            try { 
                Log.d("AgroConnect", "Fetching advisories for tab: $selectedTab")
                val allAdvisories = AgroRepository.getAdvisories()
                Log.d("AgroConnect", "Total advisories fetched: ${allAdvisories.size}")
                
                advisories = if (selectedTab == 1) {
                    allAdvisories.filter { 
                        it.advisoryType.contains("Scheme", ignoreCase = true) || 
                        it.advisoryType.contains("Gov", ignoreCase = true) 
                    }
                } else {
                    allAdvisories.filter { 
                        !it.advisoryType.contains("Scheme", ignoreCase = true) && 
                        !it.advisoryType.contains("Gov", ignoreCase = true) 
                    }
                }
                Log.d("AgroConnect", "Final filtered count: ${advisories.size}")
            } catch (e: Exception) { 
                Log.e("AgroConnect", "AdvisoriesScreen failed: ${e.message}", e) 
            }
            loading = false
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        TabRow(selectedTabIndex = selectedTab) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title) }
                )
            }
        }

        if (loading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
            ) {
                item {
                    Text("📋 ${advisories.size} ${tabs[selectedTab].lowercase()} found", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                
                items(advisories) { adv ->
                    val isExpanded = expandedId == adv.advisoryId
                    val urgencyColor = when (adv.urgency) {
                        "CRITICAL" -> Danger; "HIGH" -> WarningDark; "MEDIUM" -> Info; else -> Success
                    }
                    val typeEmoji = when (adv.advisoryType) {
                        "Pest Control" -> "🐛"; "Irrigation" -> "💧"; "Fertilization" -> "🌱"
                        "Weather" -> "⛈️"; "Storage" -> "📦"; "Market Intelligence" -> "📊"
                        "Soil Health" -> "🧪"; else -> "📋"
                    }

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { expandedId = if (isExpanded) -1 else adv.advisoryId },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = if (isExpanded) 3.dp else 1.dp),
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.Top) {
                                Text(typeEmoji, style = MaterialTheme.typography.titleLarge)
                                Spacer(Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(adv.titleEn, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
                                    Spacer(Modifier.height(4.dp))
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Box(
                                            modifier = Modifier
                                                .height(22.dp)
                                                .background(
                                                    color = urgencyColor.copy(alpha = 0.12f),
                                                    shape = RoundedCornerShape(11.dp)
                                                )
                                                .padding(horizontal = 8.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(adv.urgency, style = MaterialTheme.typography.labelSmall, color = urgencyColor)
                                        }
                                        Box(
                                            modifier = Modifier
                                                .height(22.dp)
                                                .background(
                                                    color = MaterialTheme.colorScheme.surfaceVariant,
                                                    shape = RoundedCornerShape(11.dp)
                                                )
                                                .padding(horizontal = 8.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(adv.advisoryType, style = MaterialTheme.typography.labelSmall)
                                        }
                                    }
                                }
                                Icon(if (isExpanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore, contentDescription = "ExpandMore icon",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }

                            if (!isExpanded) {
                                Spacer(Modifier.height(6.dp))
                                Text(
                                    adv.contentEn,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }

                            AnimatedVisibility(visible = isExpanded) {
                                Column {
                                    Spacer(Modifier.height(12.dp))
                                    HorizontalDivider()
                                    Spacer(Modifier.height(12.dp))
                                    Text(
                                        adv.contentEn,
                                        style = MaterialTheme.typography.bodyMedium,
                                        lineHeight = MaterialTheme.typography.bodyMedium.lineHeight,
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
