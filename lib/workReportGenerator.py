def generate_work_report(data):
 # Initialize the table with the opening <table> tag
    html = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 20px auto;">\n'
    
    # Create the header row using the first element from each array
    html += '  <thead>\n    <tr>\n'
    for col in data:
        # Use the first element from each array for the header
        header_value = col[0] if col else 'No Header'
        html += f'      <th style="padding: 10px; text-align: center;">{header_value}</th>\n'
    html += '    </tr>\n  </thead>\n'

    # Create the body of the table
    html += '  <tbody>\n'
    # Get the number of rows by finding the maximum length of the subarrays
    max_rows = max(len(col) for col in data)
    
    for row_index in range(1, max_rows):  # Start from 1 to skip the header row
        html += '    <tr>\n'
        for col in data:
            # Fill missing values with empty strings
            value = col[row_index] if row_index < len(col) else ''
            html += f'      <td style="padding: 10px; text-align: center; vertical-align: middle;">{value}</td>\n'
        html += '    </tr>\n'
    
    html += '  </tbody>\n'
    html += '</table>\n'
    
    return html

if __name__ == '__main__':
    # Example 2D array (you can modify this to test with different data)
    data = [
        ["Order ID", "56385","Potential Client","14541","89771","63630","91387"],
        ["Call Summary", "Client called, he's very anxious about not being able file for I-765 and I-131 in February. Told him on the phone that he can indeed still file for EAD and AP as long as he got his I-485 receipt notice. He wants our written confirmation here on the portal. Please provide an official response.","Asked about if her father can apply for NIW, concerned about his age; told her age shouldn’t matter too much and to submit an evaluation request on the wegreened website. She’s also expressing the concerns over demonstrating","Client wants to consult us regarding her daughter’s GC renewal. She does not want to explain her situation again to me so I transferred her to Maggie. ","Client is anxious about getting her questions answered. It has only been 24 hours and she wants a response. ","Tried to explain how PD works for client, had no luck, eventually transferred to Chu Wang","Client’s fiiance called, I told him the Waiver of Confidentiality is needed for me to discuss the specifics with him, also assigned AIS to receptionist"],

        ["Personal Notes", "When a client is angry, it’s best to try to defuse the situation by providing the answers we can instead of further delaying. However, the worst case will be when angry client is seeking legal consultation, as this is something we will have to relay to lawyer.","Next time it’s best to also advise client to put any concerns in the comments section.","To transfer, send a slack to the agent that the customer wants to transfer to and get their extension, hit transfer on RingCentral. ","For antsy client like this, simply assigned an AIS to the internal note for CM team to accelerate the response time. Do need to note that there is nowhere in contract stating how fast we are guaranteeing to respond. Usually we just say 1-2 business days.","Next time I will need to be clear about basic definitions, like priority date and final action date.","WoC task goes to receptionist."]
    ]

    # Generate the HTML table string
    html_table = generate_work_report(data)

    # Print the result
    print(html_table)