# 🏠 Home Assistant Integration

## Overview

Filamentory provides API endpoints that can be integrated with Home Assistant to automatically reduce filament amounts when prints are completed.

## Prerequisites

- Home Assistant running
- Filamentory API accessible from Home Assistant
- Authentication token for Filamentory API

## API Endpoint

### Reduce Filament Amount
```http
PATCH /api/filaments/{filament_id}/reduce
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "amount": 50
}
```

**Response:**
```json
{
  "id": "filament-id",
  "user_id": "user-id",
  "brand": "Bambu Lab",
  "filamentType": "PLA",
  "color": "White",
  "amount": 950,
  "cost": 25.99,
  "currency": "USD",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Home Assistant Configuration

### 1. REST Command

Add to your `configuration.yaml`:

```yaml
rest_command:
  reduce_filament:
    url: "http://your-filamentory-domain.com/api/filaments/{{ filament_id }}/reduce"
    method: PATCH
    headers:
      Content-Type: "application/json"
      Authorization: "Bearer {{ access_token }}"
    payload: '{"amount": {{ amount }}}'
```

### 2. Automation Example

```yaml
automation:
  - alias: "Reduce Filament After Print"
    description: "Automatically reduce filament amount when print completes"
    trigger:
      - platform: state
        entity_id: sensor.printer_status
        to: "idle"
        for:
          minutes: 1
    condition:
      - condition: state
        entity_id: sensor.print_weight
        state: "0"
        for:
          minutes: 1
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ state_attr('sensor.current_filament', 'filament_id') }}"
          amount: "{{ states('sensor.print_weight') | float }}"
          access_token: "{{ state_attr('input_text.filamentory_token', 'value') }}"
```

### 3. Input Helper for Token

Add to your `configuration.yaml`:

```yaml
input_text:
  filamentory_token:
    name: "Filamentory API Token"
    initial: "your-access-token-here"
    max: 500
```

### 4. Sensor for Current Filament

```yaml
template:
  - sensor:
      - name: "Current Filament"
        state: "{{ state_attr('sensor.printer', 'filament_type') }}"
        attributes:
          filament_id: "{{ state_attr('sensor.printer', 'filament_id') }}"
          brand: "{{ state_attr('sensor.printer', 'filament_brand') }}"
          color: "{{ state_attr('sensor.printer', 'filament_color') }}"
```

## Advanced Integration

### Multiple Printers

```yaml
automation:
  - alias: "Reduce Filament - Printer 1"
    trigger:
      - platform: state
        entity_id: sensor.printer_1_status
        to: "idle"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ state_attr('sensor.printer_1', 'filament_id') }}"
          amount: "{{ states('sensor.printer_1_weight') | float }}"
          access_token: "{{ states('input_text.filamentory_token') }}"

  - alias: "Reduce Filament - Printer 2"
    trigger:
      - platform: state
        entity_id: sensor.printer_2_status
        to: "idle"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ state_attr('sensor.printer_2', 'filament_id') }}"
          amount: "{{ states('sensor.printer_2_weight') | float }}"
          access_token: "{{ states('input_text.filamentory_token') }}"
```

### Error Handling

```yaml
automation:
  - alias: "Reduce Filament with Error Handling"
    trigger:
      - platform: state
        entity_id: sensor.printer_status
        to: "idle"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ state_attr('sensor.current_filament', 'filament_id') }}"
          amount: "{{ states('sensor.print_weight') | float }}"
          access_token: "{{ states('input_text.filamentory_token') }}"
      - delay: "00:00:05"
      - service: notify.mobile_app_your_phone
        data:
          title: "Filament Updated"
          message: "Filament amount reduced by {{ states('sensor.print_weight') }}g"
        if:
          - condition: template
            value_template: "{{ states('sensor.filamentory_status') == 'success' }}"
```

## Getting Access Token

### Method 1: From Browser
1. Login to Filamentory
2. Open browser developer tools
3. Go to Application/Storage tab
4. Find the `access_token` cookie
5. Copy the token value

### Method 2: From API
1. Use the login endpoint to get tokens
2. Store the access token securely
3. Refresh token when needed

## Security Considerations

### Token Management
- Store tokens securely in Home Assistant
- Use input helpers for easy token updates
- Consider token rotation for security
- Monitor token expiration

### Network Security
- Use HTTPS for API calls
- Consider VPN for secure communication
- Monitor API usage and rate limits
- Implement proper error handling

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check access token validity
2. **404 Not Found**: Verify filament ID exists
3. **Network Errors**: Check connectivity and URL
4. **Rate Limiting**: Implement delays between requests

### Debugging

```yaml
automation:
  - alias: "Debug Filamentory API"
    trigger:
      - platform: state
        entity_id: input_boolean.debug_filamentory
        to: "on"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "test-filament-id"
          amount: 10
          access_token: "{{ states('input_text.filamentory_token') }}"
      - service: system_log.write
        data:
          message: "Filamentory API call completed"
          level: info
```

## Example Use Cases

### 1. Automatic Filament Tracking
- Monitor printer status
- Detect print completion
- Calculate filament usage
- Update inventory automatically

### 2. Low Filament Alerts
- Check filament amounts
- Send notifications when low
- Suggest reordering
- Track usage patterns

### 3. Print Cost Calculation
- Track filament usage per print
- Calculate material costs
- Generate cost reports
- Optimize print settings

## Integration with Other Services

### OctoPrint
```yaml
automation:
  - alias: "OctoPrint Filament Tracking"
    trigger:
      - platform: mqtt
        topic: "octoprint/event/PrintDone"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ trigger.payload_json.filament_id }}"
          amount: "{{ trigger.payload_json.filament_used }}"
          access_token: "{{ states('input_text.filamentory_token') }}"
```

### Klipper
```yaml
automation:
  - alias: "Klipper Filament Tracking"
    trigger:
      - platform: state
        entity_id: sensor.klipper_status
        to: "complete"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "{{ state_attr('sensor.klipper', 'filament_id') }}"
          amount: "{{ states('sensor.klipper_filament_used') | float }}"
          access_token: "{{ states('input_text.filamentory_token') }}"
```
